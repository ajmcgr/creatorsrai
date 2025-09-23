import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Platform = 'youtube' | 'tiktok' | 'instagram';

type TopItem = {
  rank: number;
  id: string;
  displayName: string;
  username?: string;
  avatar?: string;
  followers: number;
  platform: Platform;
};

type AvatarResult = {
  avatar?: string;
};

export function useAvatarEnrichment(items: TopItem[], platform: Platform) {
  const [enrichedItems, setEnrichedItems] = useState<TopItem[]>(items);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEnrichedItems(items);
    
    if (items.length === 0) return;

    const enrichAvatars = async () => {
      setLoading(true);
      
      try {
        // Extract IDs and metadata for items that don't have avatars
        const itemsToEnrich = items.filter(item => !item.avatar);
        
        if (itemsToEnrich.length === 0) {
          setLoading(false);
          return;
        }

        const ids = itemsToEnrich.map(item => item.id);
        const displayNames = Object.fromEntries(
          itemsToEnrich.map(item => [item.id, item.displayName])
        );
        const usernames = Object.fromEntries(
          itemsToEnrich.map(item => [item.id, item.username || ''])
        );

        console.log(`Enriching avatars for ${ids.length} ${platform} creators...`);

        // Call the avatar enrichment edge function
        const { data, error } = await supabase.functions.invoke('avatar-enrichment', {
          body: {
            platform,
            ids,
            displayNames,
            usernames
          }
        });

        if (error) {
          console.error('Error enriching avatars:', error);
          return;
        }

        const avatars: Record<string, AvatarResult> = data?.avatars || {};
        
        // Update items with enriched avatars
        setEnrichedItems(prevItems => 
          prevItems.map(item => ({
            ...item,
            avatar: avatars[item.id]?.avatar || item.avatar
          }))
        );

        console.log(`Successfully enriched ${Object.keys(avatars).length} avatars`);
        
      } catch (error) {
        console.error('Error calling avatar enrichment:', error);
      } finally {
        setLoading(false);
      }
    };

    // Delay enrichment slightly to let the main table render first
    const timeoutId = setTimeout(enrichAvatars, 100);
    
    return () => clearTimeout(timeoutId);
  }, [items, platform]);

  return {
    items: enrichedItems,
    loading
  };
}