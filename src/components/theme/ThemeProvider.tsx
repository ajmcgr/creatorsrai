import React from 'react';
import type { BackgroundMode } from '@/types/kit';

export type Theme = {
  textColor: string;
  fontFamily?: string;
  backgroundMode: BackgroundMode;
  backgroundColor?: string;
  backgroundGradient?: string;
  backgroundWallpaperUrl?: string;
  sectionBackground?: string;
};

export const ThemeProvider: React.FC<{ theme: Theme; children: React.ReactNode }> = ({ theme, children }) => {
  const style: React.CSSProperties = {
    ['--kit-text' as any]: theme.textColor || '#111111',
    ['--kit-font' as any]: theme.fontFamily || 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    ['--kit-bg-color' as any]: theme.backgroundColor || '#ffffff',
    ['--kit-bg-gradient' as any]: theme.backgroundGradient || 'none',
    ['--kit-bg-wallpaper' as any]: theme.backgroundWallpaperUrl ? `url("${theme.backgroundWallpaperUrl}")` : 'none',
    ['--section-bg' as any]: theme.sectionBackground || 'rgba(255,255,255,0.1)',
  };
  
  return <div style={style}>{children}</div>;
};
