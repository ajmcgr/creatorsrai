import { Instagram, Youtube, Music, Twitter, Facebook, Linkedin, Twitch, Camera, Pin, AtSign, type LucideIcon } from "lucide-react";
import type { SocialStats } from "@/types/social";
import { Metric } from "./SocialMetric";

interface SocialCardProps {
  stats: SocialStats;
  isManual?: boolean;
  className?: string;
  style?: React.CSSProperties;
  customStyles?: any;
}

export function SocialCard({ stats, isManual = false, className = '', style = {}, customStyles }: SocialCardProps) {
  const getIcon = (platform: string): LucideIcon => {
    const icons: Record<string, LucideIcon> = {
      instagram: Instagram,
      youtube: Youtube,
      tiktok: Music,
      twitter: Twitter,
      facebook: Facebook,
      linkedin: Linkedin,
      twitch: Twitch,
      snapchat: Camera,
      pinterest: Pin,
      threads: AtSign
    };
    return icons[typeof platform === 'string' ? platform.toLowerCase() : ''] || AtSign;
  };
  
  const Icon = getIcon(stats.platform);
  
  const platformLabel = String(stats.platform || '').charAt(0).toUpperCase() + String(stats.platform || '').slice(1);
  
  // Helper function to clean username from URLs
  const cleanUsername = (input: string): string => {
    if (!input) return '';
    
    // Remove common URL patterns
    let cleaned = input
      .replace(/^https?:\/\/(www\.)?/, '') // Remove http(s)://www.
      .replace(/^(instagram|tiktok|youtube|twitter|facebook|linkedin|twitch|snapchat|pinterest|threads)\.com\//, '') // Remove domain
      .replace(/^in\//, '') // Remove LinkedIn's /in/ prefix
      .replace(/^\/@/, '') // Remove leading /@
      .replace(/^@/, '') // Remove leading @
      .replace(/\/$/, ''); // Remove trailing /
    
    // For YouTube, remove the @ if it's still there
    if (cleaned.startsWith('@')) {
      cleaned = cleaned.substring(1);
    }
    
    // Get just the username part (before any additional path segments)
    const parts = cleaned.split('/');
    cleaned = parts[0];
    
    return cleaned;
  };
  
  const avatarSrc = (() => {
    if (stats.avatar_url) return stats.avatar_url;
    if (isManual) return '/placeholder.svg';
    
    const u = stats.username || stats.id || '';
    const clean = cleanUsername(u);
    if (stats.platform === 'instagram') return `https://unavatar.io/instagram/${clean}`;
    if (stats.platform === 'tiktok') return `https://unavatar.io/tiktok/${clean}`;
    if (stats.platform === 'youtube') {
      const cid = (stats.id || '').startsWith('UC') ? stats.id : null;
      return cid ? `https://unavatar.io/youtube/${cid}` : `https://unavatar.io/youtube/@${clean}`;
    }
    return '/placeholder.svg';
  })();

  const profileUrl = (() => {
    const u = stats.username || stats.id || '';
    const clean = cleanUsername(u);
    if (stats.platform === 'instagram') return `https://instagram.com/${clean}`;
    if (stats.platform === 'tiktok') return `https://tiktok.com/@${clean}`;
    if (stats.platform === 'youtube') {
      const cid = (stats.id || '').startsWith('UC') ? stats.id : null;
      return cid ? `https://youtube.com/channel/${cid}` : `https://youtube.com/@${clean}`;
    }
    if (stats.platform === 'twitter') return `https://twitter.com/${clean}`;
    if (stats.platform === 'facebook') return `https://facebook.com/${clean}`;
    if (stats.platform === 'linkedin') return `https://linkedin.com/in/${clean}`;
    if (stats.platform === 'twitch') return `https://twitch.tv/${clean}`;
    if (stats.platform === 'snapchat') return `https://snapchat.com/add/${clean}`;
    if (stats.platform === 'pinterest') return `https://pinterest.com/${clean}`;
    if (stats.platform === 'threads') return `https://threads.net/@${clean}`;
    return '';
  })();
  
  // Clean display username
  const displayUsername = stats.username ? cleanUsername(stats.username) : '';
  
  const cardStyle = (() => {
    const section = customStyles?.sectionStyles;
    const s: any = { ...style };
    
    // If no customStyles, use theme CSS variables
    if (!customStyles) {
      s.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      s.backdropFilter = 'blur(16px)';
      s.WebkitBackdropFilter = 'blur(16px)';
      s.color = 'inherit'; // Inherit from kit-root
      return s;
    }
    
    if (customStyles?.fontFamily) s.fontFamily = customStyles.fontFamily;

    if (section?.background === 'colored') {
      s.backgroundColor = customStyles?.primaryColor;
      s.color = customStyles?.secondaryColor;
    } else if (section?.background === 'white') {
      s.backgroundColor = '#ffffff';
    } else if (section?.background === 'gradient') {
      if (customStyles?.gradient) s.background = customStyles.gradient;
      if (customStyles?.secondaryColor) s.color = customStyles.secondaryColor;
    } else if (section?.background === 'glass') {
      s.backgroundColor = 'rgba(255,255,255,0.1)';
      (s as any).backdropFilter = 'blur(16px)';
      (s as any).WebkitBackdropFilter = 'blur(16px)';
      if (customStyles?.secondaryColor) s.color = customStyles.secondaryColor;
    }

    if (section?.borderStyle && section.borderStyle !== 'none') {
      s.borderColor = customStyles?.accentColor || customStyles?.primaryColor;
      if (section.borderStyle === 'bold') s.borderWidth = '4px';
      if (section.borderStyle === 'outlined') s.borderWidth = '2px';
      if (section.borderStyle === 'subtle') s.borderWidth = '1px';
    }

    return s;
  })();

  const hasBorder = !!customStyles?.sectionStyles && customStyles.sectionStyles.borderStyle && customStyles.sectionStyles.borderStyle !== 'none';
  
  
  return (
    <div 
      className={`themed-card p-6 shadow-card ${className}`}
      style={{ ...cardStyle }}
    >
      <div className="flex-1 min-w-0">
        <a href={profileUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mb-1 hover:opacity-80">
          <Icon 
            className="h-4 w-4"
            style={customStyles ? { color: customStyles.accentColor } : { color: 'inherit' }}
          />
          <span 
            className="text-sm underline"
            style={customStyles ? { color: customStyles.accentColor } : { color: 'inherit' }}
          >
            {platformLabel}
          </span>
        </a>
        <div 
          className="font-semibold text-lg truncate"
          style={customStyles ? { fontFamily: customStyles.fontFamily } : { color: 'inherit' }}
        >
          {stats.display_name || displayUsername || 'Unknown'}
        </div>
        {displayUsername && stats.display_name && (
          <div 
            className="text-sm truncate"
            style={customStyles ? { color: customStyles.accentColor, opacity: 0.7, fontFamily: customStyles.fontFamily } : { color: 'inherit', opacity: 0.7 }}
          >
            @{displayUsername}
          </div>
        )}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Metric 
            label={stats.platform === 'youtube' ? 'Subscribers' : 'Followers'} 
            value={stats.followers} 
          />
          {!isManual && (
            <>
              <Metric 
                label={stats.platform === 'youtube' ? 'Videos' : 'Posts'} 
                value={stats.posts} 
              />
              <Metric 
                label="Engagement" 
                value={stats.engagement_rate} 
                format="percent"
              />
            </>
          )}
        </div>
        {!isManual && typeof stats.views === 'number' ? (
          <div 
            className="mt-2 text-sm"
            style={customStyles ? { color: customStyles.accentColor, opacity: 0.7 } : { color: 'inherit', opacity: 0.7 }}
          >
            Total Views: {stats.views.toLocaleString()}
          </div>
        ) : null}
      </div>
    </div>
  );
}
