import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import PublicKit from '@/components/kit/PublicKit';
import { mapKitToPublicData } from '@/lib/kit/map';
import type { PublicKitData } from '@/lib/kit/map';

const PublicMediaKit = () => {
  const { username } = useParams();
  const [kitData, setKitData] = useState<PublicKitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hide Crisp chat on public profile pages
  useEffect(() => {
    const crisp = (window as any).$crisp;
    if (crisp) crisp.push(['do', 'chat:hide']);
    return () => {
      const c = (window as any).$crisp;
      if (c) c.push(['do', 'chat:show']);
    };
  }, []);

  // Load by public slug and transform to PublicKitData so it matches the Editor preview exactly
  useEffect(() => {
    const load = async () => {
      if (!username) {
        setError('No username provided');
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('media_kits')
          .select('*')
          .eq('public_url_slug', username)
          .maybeSingle();
        if (error) throw error;
        if (!data) throw new Error('Media kit not found');

        // Try to refresh latest public data via edge function (ensures fresh 'paid' flag)
        let kitRow: any = data;
        try {
          const resp = await supabase.functions.invoke('fetch-media-kit-public', {
            body: { kit_id: data.id },
          });
          if (resp.data?.ok && resp.data.kit) {
            kitRow = resp.data.kit;
          }
        } catch (_) {
          // ignore if edge function fails; fallback to direct row
        }

        // Track view asynchronously (fire and forget)
        try {
          await supabase.from('media_kit_views').insert({
            media_kit_id: kitRow.id,
            viewer_device: navigator.userAgent,
            referrer: document.referrer || 'direct',
          });
        } catch (e) {
          // ignore
        }

        // Use unified mapper - it handles published_json if present
        const publicData = mapKitToPublicData(kitRow);
        setKitData(publicData);
      } catch (err: any) {
        console.error('[PublicMediaKit] load error', err);
        setError(err.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !kitData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Media Kit Not Found</h1>
          <p className="text-muted-foreground">{error || 'This media kit does not exist or has not been published'}</p>
        </div>
      </div>
    );
  }

  return <PublicKit data={kitData} />;
};

export default PublicMediaKit;
