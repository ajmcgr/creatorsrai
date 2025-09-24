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

export function useInViewAvatarEnrichment(
  item: TopItem,
  platform: Platform,
  options?: { initialInView?: boolean }
) {
  const initialInView = options?.initialInView ?? false;
  const [enrichedItem, setEnrichedItem] = useState<TopItem>(item);
  const [loading, setLoading] = useState(false);
  const [isInView, setIsInView] = useState(initialInView);
  const elementRef = useRef<HTMLDivElement>(null);

  // Set up intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin: '100px', // Start loading 100px before the item comes into view
        threshold: 0.1
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
      
      // Immediately check if element is already in view on mount
      const rect = elementRef.current.getBoundingClientRect();
      const isCurrentlyInView = rect.top < window.innerHeight && rect.bottom > 0;
      if (isCurrentlyInView) {
        setIsInView(true);
      }
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  // Enrich avatar when item comes into view
  useEffect(() => {
    if (!isInView || item.avatar || loading) return;

    let cancelled = false;

    const enrichAvatar = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('avatar-enrichment', {
          body: {
            platform,
            ids: [item.id],
            displayNames: { [item.id]: item.displayName },
            usernames: { [item.id]: item.username || '' },
          },
        });

        if (cancelled) return;

        if (error) {
          console.error('Error enriching avatar:', error);
          return;
        }

        const avatars: Record<string, AvatarResult> = data?.avatars || {};
        const newAvatar = avatars[item.id]?.avatar;

        if (newAvatar) {
          setEnrichedItem(prev => ({ ...prev, avatar: newAvatar }));
        }
      } catch (err) {
        if (!cancelled) console.error('Error calling avatar enrichment:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const timeoutId = setTimeout(enrichAvatar, 100);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isInView, item.avatar, item.id, item.displayName, item.username, platform, loading]);

  // Update enriched item when the base item changes
  useEffect(() => {
    setEnrichedItem(item);
  }, [item]);

  return {
    item: enrichedItem,
    loading,
    elementRef
  };
}