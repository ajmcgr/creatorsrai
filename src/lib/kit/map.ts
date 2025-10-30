export type BackgroundMode = 'color' | 'gradient' | 'wallpaper';

export interface PublicKitData {
  id: string;
  kitId?: string;
  name: string;
  bio: string;
  summary?: string;
  avatarUrl?: string;
  email?: string;
  theme?: {
    textColor: string;
    font: string;
    backgroundMode: BackgroundMode;
    backgroundColor?: string;
    backgroundGradient?: string;
    backgroundWallpaperUrl?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    buttonVariant?: string;
  };
  socials?: Array<{
    platform: string;
    handle: string;
    url: string;
    followers?: number;
    avatar_url?: string;
    display_name?: string;
  }>;
  sections?: any[];
  links?: any[];
  rates?: Array<{
    label: string;
    price: string;
  }>;
  documents?: Array<{
    name: string;
    url: string;
    size?: number;
  }>;
  clients?: Array<{
    name: string;
    logoUrl?: string;
  }>;
  totalFollowers?: number;
  isPaid?: boolean;
  meta?: {
    lastBackgroundChangeAt?: string;
  };
  [key: string]: any;
}

export function mapKitToPublicData(kit: any, options?: { preferSnapshot?: boolean }): PublicKitData {
  const preferSnapshot = options?.preferSnapshot !== false;
  
  if (preferSnapshot && kit?.published_json && Object.keys(kit.published_json || {}).length > 0) {
    return { ...kit.published_json, isPaid: kit?.paid || false } as PublicKitData;
  }
  if (preferSnapshot && kit?.draft_json && Object.keys(kit.draft_json || {}).length > 0) {
    return { ...kit.draft_json, isPaid: kit?.paid || false } as PublicKitData;
  }

  const s = kit?.custom_styles ?? {};
  const textColor = s.textColor || s.secondaryColor || '#111111';

  const socialData = kit?.social_stats || kit?.social_data || {};
  const socials: PublicKitData['socials'] = [];
  let totalFollowers = 0;

  const cleanHandle = (input: string): string => {
    if (!input) return '';
    return input
      .replace(/^https?:\/\/(www\.)?/, '')
      .replace(/^(instagram|tiktok|youtube|twitter|x|facebook|linkedin|twitch|snapchat|pinterest|threads)\.com\//, '')
      .replace(/^in\//, '')
      .replace(/^\/@/, '')
      .replace(/^@/, '')
      .replace(/\/$/, '')
      .split('/')[0];
  };

  const buildUrl = (platform: string, handle: string): string => {
    const cleaned = cleanHandle(handle);
    const urlMap: Record<string, string> = {
      instagram: `https://instagram.com/${cleaned}`,
      youtube: `https://youtube.com/@${cleaned}`,
      tiktok: `https://tiktok.com/@${cleaned}`,
      twitter: `https://x.com/${cleaned}`,
      x: `https://x.com/${cleaned}`,
      facebook: `https://facebook.com/${cleaned}`,
      linkedin: `https://linkedin.com/in/${cleaned}`,
      twitch: `https://twitch.tv/${cleaned}`,
      snapchat: `https://snapchat.com/add/${cleaned}`,
      pinterest: `https://pinterest.com/${cleaned}`,
      threads: `https://threads.net/@${cleaned}`
    };
    return urlMap[platform.toLowerCase()] || `https://${platform}.com/${cleaned}`;
  };

  Object.entries(socialData).forEach(([platform, value]: [string, any]) => {
    const username = typeof value === 'string' ? value : (value?.username || value?.id || '');
    const followers = typeof value === 'object' ? (value?.followers || value?.followerCount) : undefined;
    const avatarUrl = typeof value === 'object' ? value?.avatar_url : undefined;
    const displayName = typeof value === 'object' ? value?.display_name : undefined;

    if (username) {
      socials.push({
        platform,
        url: buildUrl(platform, username),
        handle: cleanHandle(username),
        followers,
        avatar_url: avatarUrl,
        display_name: displayName
      });
      if (followers) totalFollowers += followers;
    }
  });

  const sections: PublicKitData['sections'] = [];
  const rates = s.rates || kit?.rates || [];
  if (rates.length > 0) {
    sections.push({ kind: 'rates', data: { items: rates } });
  }

  const documents = s.documents || kit?.documents || [];
  if (documents.length > 0) {
    sections.push({ kind: 'portfolio', data: { items: documents } });
  }

  const clients = s.clients || kit?.clients || [];
  if (clients.length > 0) {
    sections.push({ kind: 'clients', data: { items: clients } });
  }

  return {
    id: kit?.id,
    kitId: kit?.id,
    name: kit?.name || 'Untitled',
    bio: kit?.bio || '',
    summary: kit?.ai_summary || kit?.summary || '',
    avatarUrl: kit?.avatar_url,
    email: kit?.email,
    theme: {
      textColor,
      font: s.font || s.fontFamily || 'Inter',
      backgroundMode: s.backgroundMode || 'color',
      backgroundColor: s.backgroundColor || s.primaryColor || '#ffffff',
      backgroundGradient: s.backgroundGradient || s.gradient || '',
      backgroundWallpaperUrl: s.backgroundWallpaperUrl || s.backgroundImage || '',
      buttonColor: s.buttonColor,
      buttonTextColor: s.buttonTextColor,
      buttonVariant: s.buttonVariant || 'solid',
    },
    socials,
    sections,
    links: kit?.links || [],
    rates,
    totalFollowers: kit?.followers_total || totalFollowers || undefined,
    documents,
    clients,
    isPaid: kit?.paid || false,
  };
}
