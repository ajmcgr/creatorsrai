import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useMediaKit(kitId?: string) {
  const [kit, setKit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchKit = async () => {
    if (!kitId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError(new Error('Not authenticated'));
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('media_kits')
        .select('*')
        .eq('id', kitId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      
      setKit(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setKit(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKit();
  }, [kitId]);

  return {
    kit,
    loading,
    error,
    refetch: fetchKit,
  };
}
