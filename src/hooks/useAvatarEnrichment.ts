import { useState, useEffect, useRef } from 'react';
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
  const idsKeyRef = useRef<string>('');

  useEffect(() => {
    // Build a stable identity key based on item ids to avoid loops from array identity changes
    const idsKey = items.map(i => i.id).join(',');
    const contentChanged = idsKey !== idsKeyRef.current;
    if (contentChanged) {
      setEnrichedItems(items);
      idsKeyRef.current = idsKey;
    }

    if (items.length === 0) return;

    const itemsToEnrich = items.filter(item => !item.avatar);
    if (itemsToEnrich.length === 0) return;

    let cancelled = false;

    const enrichAvatars = async () => {
      setLoading(true);
      try {
        const ids = itemsToEnrich.map(item => item.id);
        const displayNames = Object.fromEntries(
          itemsToEnrich.map(item => [item.id, item.displayName])
        );
        const usernames = Object.fromEntries(
          itemsToEnrich.map(item => [item.id, item.username || ''])
        );

        // Call the avatar enrichment backend function
        const { data, error } = await supabase.functions.invoke('avatar-enrichment', {
          body: {
            platform,
            ids,
            displayNames,
            usernames,
          },
        });

        if (cancelled) return;

        if (error) {
          console.error('Error enriching avatars:', error);
          return;
        }

        const avatars: Record<string, AvatarResult> = data?.avatars || {};

        // Only update state if something actually changed
        setEnrichedItems(prevItems => {
          let changed = false;
          const next = prevItems.map(item => {
            const newAvatar = avatars[item.id]?.avatar;
            if (newAvatar && newAvatar !== item.avatar) {
              changed = true;
              return { ...item, avatar: newAvatar };
            }
            return item;
          });
          return changed ? next : prevItems;
        });
      } catch (err) {
        if (!cancelled) console.error('Error calling avatar enrichment:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // Slight delay to let the main table render first
    const timeoutId = setTimeout(enrichAvatars, 100);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [platform, items]);

  return {
    items: enrichedItems,
    loading
  };
}