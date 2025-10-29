export type BackgroundMode = 'color' | 'gradient' | 'wallpaper';

export interface PublicKitData {
  id: string;
  kitId?: string;
  name: string;
  bio: string;
  avatarUrl?: string;
  email?: string;
  theme?: {
    textColor: string;
    font: string;
    backgroundMode: BackgroundMode;
    backgroundColor?: string;
    backgroundGradient?: string;
    backgroundWallpaperUrl?: string;
  };
  socials?: Array<{
    platform: string;
    handle: string;
    url: string;
    followers?: number;
    display_name?: string;
  }>;
  sections?: any[];
  links?: any[];
  rates?: Array<{
    label: string;
    price: string;
  }>;
  meta?: {
    lastBackgroundChangeAt?: string;
  };
  [key: string]: any;
}

export const mapKitToPublicData = (kit: any): PublicKitData => {
  // If published_json exists, use it; otherwise use the raw kit data
  const source = kit.published_json || kit;
  
  return {
    id: kit.id,
    name: source.name,
    bio: source.bio,
    ...source,
  };
};
