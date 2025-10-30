import React, { useEffect } from 'react';
import '@/styles/kit.force.css';
import { PublicKitData } from '@/lib/kit/map';

const Icon = ({ platform }: { platform: string }) => {
  const iconClass = "transition-transform hover:scale-110";
  switch (platform.toLowerCase()) {
    case 'twitter':
    case 'x':
      return (<svg viewBox="0 0 24 24" width="24" height="24" aria-label="X" className={iconClass}><path fill="currentColor" d="M18.244 3H21l-6.56 7.49L22.5 21h-6.59l-5.17-6.2L4.7 21H2l7.06-8.06L1.5 3h6.75l4.66 5.59L18.244 3zm-2.31 16h1.78L7.14 5H5.3l10.634 14z"/></svg>);
    case 'instagram':
      return (<svg viewBox="0 0 24 24" width="24" height="24" aria-label="Instagram" className={iconClass}><path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm11 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-6 2.5A4.5 4.5 0 1 1 7.5 13 4.5 4.5 0 0 1 12 8.5zm0 2A2.5 2.5 0 1 0 14.5 13 2.5 2.5 0 0 0 12 10.5z"/></svg>);
    case 'youtube':
      return (<svg viewBox="0 0 24 24" width="24" height="24" aria-label="YouTube" className={iconClass}><path fill="currentColor" d="M23 7.5s-.2-1.6-.8-2.3c-.7-.8-1.4-.8-1.8-.9C17.2 4 12 4 12 4h0s-5.2 0-8.4.3c-.4 0-1.1.1-1.8.9C1.2 5.9 1 7.5 1 7.5S.8 9.4.8 11.3v1.3C.8 14.4 1 16.3 1 16.3s.2 1.6.8 2.3c.7.8 1.6.8 2 .9 1.4.1 8.2.3 8.2.3s5.2 0 8.4-.3c.4 0 1.1-.1 1.8-.9.6-.7.8-2.3.8-2.3s.2-1.9.2-3.7v-1.3c0-1.9-.2-3.8-.2-3.8zM10 9.8l5.5 3.2L10 16.2V9.8z"/></svg>);
    case 'tiktok':
      return (<svg viewBox="0 0 24 24" width="24" height="24" aria-label="TikTok" className={iconClass}><path fill="currentColor" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>);
    case 'linkedin':
      return (<svg viewBox="0 0 24 24" width="24" height="24" aria-label="LinkedIn" className={iconClass}><path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.6h.1c.5-.9 1.8-1.9 3.8-1.9 4 0 4.7 2.6 4.7 6v6.3h-4v-5.6c0-1.3 0-3-1.8-3s-2 1.4-2 2.9V21h-4z"/></svg>);
    case 'facebook':
      return (<svg viewBox="0 0 24 24" width="24" height="24" aria-label="Facebook" className={iconClass}><path fill="currentColor" d="M13 3h3V0h-3c-3.3 0-6 2.7-6 6v3H4v4h3v9h4v-9h3l1-4h-4V6c0-.6.4-1 1-1Z"/></svg>);
    case 'spotify':
      return (<svg viewBox="0 0 24 24" width="24" height="24" aria-label="Spotify" className={iconClass}><path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>);
    case 'apple_podcasts':
      return (<svg viewBox="0 0 24 24" width="24" height="24" aria-label="Apple Podcasts" className={iconClass}><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>);
    default:
      return null;
  }
};

export default function PublicKit({ data }: { data: PublicKitData }) {
  const { theme } = data;
  
  // Determine background mode - prioritize gradient if it exists
  const bgMode = theme?.backgroundGradient && theme.backgroundGradient !== '' && theme.backgroundGradient !== 'none' 
    ? 'gradient' 
    : theme?.backgroundWallpaperUrl && theme.backgroundWallpaperUrl !== '' && theme.backgroundWallpaperUrl !== 'none'
    ? 'wallpaper'
    : 'color';
  
  const selectedFont = (theme?.font || 'Inter').split(',')[0]?.replace(/['"]/g, '').trim();
  const fontCss = `"${selectedFont}", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"`;

  const style: React.CSSProperties = {
    ['--kit-text' as any]: theme?.textColor,
    ['--kit-font' as any]: fontCss,
    ['--kit-bg-color' as any]: theme?.backgroundColor || '#ffffff',
    ['--kit-bg-gradient' as any]: theme?.backgroundGradient || '',
    ['--kit-bg-wallpaper' as any]: theme?.backgroundWallpaperUrl ? `url("${theme.backgroundWallpaperUrl}")` : '',
  };

  useEffect(() => {
    if (!selectedFont) return;
    const familyParam = selectedFont.replace(/\s+/g, '+');
    const href = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@400;700&display=swap`;
    let link = document.getElementById('kit-font-link') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = 'kit-font-link';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = href;
  }, [selectedFont]);

  const variant = theme?.buttonVariant || 'solid';
  const btnBgColor = theme?.buttonColor;
  const btnTextColor = theme?.buttonTextColor || '#ffffff';
  const solidStyle: React.CSSProperties = { background: btnBgColor || 'rgba(0,0,0,0.1)' };
  const outlineStyle: React.CSSProperties = { background: 'transparent', borderColor: btnBgColor || 'currentColor', borderWidth: 2, borderStyle: 'solid' };
  const glassStyle: React.CSSProperties = { background: btnBgColor ? `${btnBgColor}26` : 'rgba(0,0,0,0.08)', borderColor: btnBgColor ? `${btnBgColor}40` : 'transparent', borderWidth: 1, borderStyle: 'solid', backdropFilter: 'blur(6px)' };
  const baseBtnVars: React.CSSProperties = { ['--kit-button-text' as any]: btnTextColor };
  const btnStyle = () => ({ ...(variant === 'outline' ? outlineStyle : variant === 'glass' ? glassStyle : solidStyle), ...baseBtnVars });

  return (
    <div
      id="kit-content"
      className="kit-root min-h-screen w-full"
      style={{ ['--kit-text' as any]: theme?.textColor, ['--kit-font' as any]: fontCss }}
    >
      <div className="md:p-8">
        <div 
          className="mx-auto max-w-2xl md:rounded-[32px] md:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          style={style}
          data-bg={bgMode}
        >
          <div className="mx-auto max-w-2xl p-6 md:p-12 space-y-8">
        {/* Header - Centered layout */}
        <div className="flex flex-col items-center text-center space-y-2">
          {/* Avatar */}
          {data.avatarUrl && (
            <img 
              src={data.avatarUrl} 
              alt={data.name} 
              className="h-24 w-24 md:h-28 md:w-28 rounded-full object-cover shadow-lg" 
            />
          )}
          
          {/* Name */}
          <h1 className="text-3xl md:text-4xl font-black" style={{ fontWeight: 800 }}>{data.name}</h1>
          
          {/* Bio */}
          {data.bio && (
            <p className="text-base md:text-lg font-bold max-w-2xl">{data.bio}</p>
          )}
          
          {/* Summary */}
          {(data as any).summary && (
            <p className="text-sm md:text-base opacity-70 max-w-xl font-normal not-italic">{(data as any).summary}</p>
          )}
        </div>

        {/* Total follower count */}
        {(data as any).totalFollowers && (data as any).totalFollowers > 0 && (
          <div className="text-center py-6">
            <div className="text-5xl md:text-6xl font-bold">{(data as any).totalFollowers.toLocaleString()}</div>
            <div className="text-sm md:text-base opacity-70 mt-2">Total Followers</div>
          </div>
        )}

        {/* Social icons with follower counts */}
        {data.socials?.length ? (
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {data.socials.map((s, i) => (
              <a 
                key={`${s.platform}-${i}`} 
                href={s.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={s.platform}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <Icon platform={s.platform} />
                </div>
                {s.followers && (
                  <span className="text-xs md:text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                    {s.followers.toLocaleString()}
                  </span>
                )}
              </a>
            ))}
          </div>
        ) : null}

        {/* Portfolio section */}
        {data.sections?.find(s => (s as any).kind === 'portfolio') && (() => {
          const section = data.sections?.find(s => (s as any).kind === 'portfolio');
          const items = (section as any)?.data?.items || [];
          return items.length > 0 ? (
            <div className="space-y-4 max-w-xl mx-auto">
              <h2 className="text-xl md:text-2xl font-semibold text-center">Portfolio</h2>
              <div className="space-y-2">
                {items.map((doc: any, i: number) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 rounded-lg transition-all hover:scale-[1.02]"
                    style={{ 
                      background: theme?.buttonColor ? `${theme.buttonColor}15` : 'rgba(0,0,0,0.05)',
                      borderColor: theme?.buttonColor || 'transparent',
                      borderWidth: theme?.buttonColor ? '1px' : '0'
                    }}
                  >
                    <span className="font-medium">{doc.name || doc.title}</span>
                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* Clients section */}
        {data.sections?.find(s => (s as any).kind === 'clients') && (() => {
          const section = data.sections?.find(s => (s as any).kind === 'clients');
          const items = (section as any)?.data?.items || [];
          return items.length > 0 ? (
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-xl md:text-2xl font-semibold text-center">Clients</h2>
              <div className="flex flex-wrap justify-center gap-6">
                {items.map((client: any, i: number) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    {client.logoUrl ? (
                      <img 
                        src={client.logoUrl} 
                        alt={client.name}
                        className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="px-4 py-2 rounded-lg font-medium opacity-70" style={{ background: 'rgba(0,0,0,0.05)' }}>
                        {client.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* Collaboration Rates */}
        {data.sections?.find(s => (s as any).kind === 'rates') && (() => {
          const section = data.sections?.find(s => (s as any).kind === 'rates');
          const items = (section as any)?.data?.items || [];
          return items.length > 0 ? (
            <div className="space-y-3 max-w-xl mx-auto">
              <h2 className="text-xl md:text-2xl font-semibold text-center">Collaboration Rates</h2>
              {items.map((rate: any, i: number) => (
                <div key={i} className="flex justify-between py-3 border-b border-current/10">
                  <span className="font-medium">{rate.label}</span>
                  <span className="font-bold">{rate.price}</span>
                </div>
              ))}
            </div>
          ) : null;
        })()}

        {/* Contact, Share, and Download buttons */}
        <div className="flex flex-col items-center justify-center gap-3 pt-4 max-w-md mx-auto w-full">
          {data.email && (
            <a 
              href={`mailto:${data.email}`}
              className="kit-button w-full inline-block px-8 py-5 rounded-lg font-semibold text-center text-lg transition-all hover:scale-105"
              style={btnStyle()}
            >
              Contact Me
            </a>
          )}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${data.name}'s Media Kit`,
                  text: data.bio || `Check out ${data.name}'s media kit`,
                  url: window.location.href
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }
            }}
            className="kit-button w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            style={btnStyle()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
          <button
            onClick={async () => {
              const { generatePDF } = await import('@/lib/exportUtils');
              await generatePDF('kit-content', `${data.name}-MediaKit.pdf`);
            }}
            className="kit-button w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all hover:scale-105"
            style={btnStyle()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
        </div>

        {/* Attribution for non-paid users */}
        {!(data as any).isPaid && (
          <div className="text-center pt-8 pb-4">
            <a 
              href="https://trycreators.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              Create your own with <strong>trycreators.ai →</strong>
            </a>
          </div>
        )}
      </div>
        </div>
      </div>
    </div>
  );
}
