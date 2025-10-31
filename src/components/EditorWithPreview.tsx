import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { BackgroundMode, PublicKitData } from '@/types/kit';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PublicKit from '@/components/kit/PublicKit';

interface EditorWithPreviewProps {
  kit: any;
  onSave?: () => void;
}

export function EditorWithPreview({ kit, onSave }: EditorWithPreviewProps) {
  const [editData, setEditData] = useState<any>({});
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('color');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [backgroundGradient, setBackgroundGradient] = useState('');
  const [backgroundWallpaper, setBackgroundWallpaper] = useState('');
  const [textColor, setTextColor] = useState('#111111');
  const [font, setFont] = useState('Inter');

  useEffect(() => {
    if (!kit) return;

    setEditData(kit);

    // Load theme settings
    const theme = kit.custom_styles || {};
    setBackgroundMode(theme.backgroundMode || 'color');
    setBackgroundColor(theme.backgroundColor || '#ffffff');
    setBackgroundGradient(theme.backgroundGradient || theme.gradient || '');
    setBackgroundWallpaper(theme.backgroundWallpaperUrl || theme.backgroundImage || '');
    setTextColor(theme.textColor || theme.secondaryColor || '#111111');
    setFont(theme.font || theme.fontFamily || 'Inter');
  }, [kit]);

  const buildPreviewData = (): PublicKitData => {
    const socialData = kit?.social_stats || kit?.social_data || {};
    const socials: any[] = [];
    Object.entries(socialData).forEach(([platform, value]: [string, any]) => {
      if (!value) return;
      const username = typeof value === 'string' ? value : (value.username || value.id || '');
      const followers = typeof value === 'object' ? (value.followers || value.followerCount) : undefined;
      const displayName = typeof value === 'object' ? value.display_name : undefined;
      if (username) {
        socials.push({
          platform,
          handle: username,
          url: `https://${platform}.com/${username}`,
          followers,
          display_name: displayName
        });
      }
    });

    return {
      id: kit.id,
      kitId: kit.id,
      name: editData.name ?? kit.name ?? 'Untitled',
      bio: editData.bio ?? kit.bio ?? '',
      avatarUrl: editData.avatar_url ?? kit.avatar_url,
      email: editData.email ?? kit.email,
      theme: {
        textColor,
        font,
        backgroundMode,
        backgroundColor,
        backgroundGradient,
        backgroundWallpaperUrl: backgroundWallpaper,
      },
      socials,
      sections: [],
      links: [],
      rates: kit.custom_rate ? [{ label: 'Custom Rate', price: `$${kit.custom_rate}` }] : [],
      meta: { lastBackgroundChangeAt: new Date().toISOString() },
    };
  };

  const handleBackgroundModeChange = (mode: BackgroundMode) => {
    setBackgroundMode(mode);
    if (mode === 'color') {
      setBackgroundGradient('');
      setBackgroundWallpaper('');
    } else if (mode === 'gradient') {
      setBackgroundWallpaper('');
    } else if (mode === 'wallpaper') {
      setBackgroundGradient('');
    }
  };

  const handleSave = async () => {
    if (!kit?.id) return;

    try {
      const updateData: any = {
        name: editData.name || kit.name,
        bio: editData.bio || kit.bio,
        email: editData.email || kit.email,
        avatar_url: editData.avatar_url || kit.avatar_url,
        custom_styles: {
          ...(kit.custom_styles || {}),
          textColor,
          fontFamily: font,
          backgroundMode,
          backgroundColor,
          backgroundGradient,
          backgroundWallpaperUrl: backgroundWallpaper,
          lastBackgroundChangeAt: new Date().toISOString()
        }
      };

      if (editData.slug) {
        updateData.slug = editData.slug;
      }

      const { error } = await supabase
        .from('media_kits')
        .update(updateData)
        .eq('id', kit.id);

      if (error) throw error;

      toast.success('Changes saved');
      onSave?.();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error('Failed to save changes');
    }
  };

  const handleWallpaperUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `wallpaper-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setBackgroundWallpaper(publicUrl);
      setBackgroundMode('wallpaper');
      toast.success('Wallpaper uploaded!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload wallpaper');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-screen">
      {/* Editor Panel */}
      <div className="overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Edit Media Kit</h2>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="background">Background</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editData.name || ''}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editData.slug || ''}
                onChange={(e) => setEditData({ ...editData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                placeholder="yourname"
              />
              <p className="text-xs text-muted-foreground mt-1">
                trycreators.ai/{editData.slug || 'yourname'}
              </p>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editData.bio || ''}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editData.email || ''}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-4">
            <div>
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-20"
                />
                <Input
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  placeholder="#111111"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="font">Font Family</Label>
              <select
                id="font"
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Inter">Inter</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Roboto">Roboto</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Poppins">Poppins</option>
              </select>
            </div>
          </TabsContent>

          <TabsContent value="background" className="space-y-4">
            <div>
              <Label>Background Type</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button
                  variant={backgroundMode === 'color' ? 'default' : 'outline'}
                  onClick={() => handleBackgroundModeChange('color')}
                >
                  Color
                </Button>
                <Button
                  variant={backgroundMode === 'gradient' ? 'default' : 'outline'}
                  onClick={() => handleBackgroundModeChange('gradient')}
                >
                  Gradient
                </Button>
                <Button
                  variant={backgroundMode === 'wallpaper' ? 'default' : 'outline'}
                  onClick={() => handleBackgroundModeChange('wallpaper')}
                >
                  Wallpaper
                </Button>
              </div>
            </div>

            {backgroundMode === 'color' && (
              <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-20"
                  />
                  <Input
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            )}

            {backgroundMode === 'gradient' && (
              <div>
                <Label htmlFor="gradient">Gradient CSS</Label>
                <Input
                  id="gradient"
                  value={backgroundGradient}
                  onChange={(e) => setBackgroundGradient(e.target.value)}
                  placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
              </div>
            )}

            {backgroundMode === 'wallpaper' && (
              <div>
                <Label>Upload Wallpaper</Label>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('wallpaper-upload')?.click()}
                  className="w-full mt-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
                <input
                  id="wallpaper-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleWallpaperUpload}
                  className="hidden"
                />
                {backgroundWallpaper && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Image uploaded
                  </p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Button onClick={handleSave} className="w-full mt-6">
          Save Changes
        </Button>
      </div>

      {/* Live Preview Panel */}
      <div className="bg-gray-100 p-6 overflow-hidden">
        <div className="bg-white rounded-lg shadow-lg mx-auto" style={{ width: 375, height: 812, overflow: 'hidden' }}>
          <div className="w-full h-full overflow-auto">
            <PublicKit data={buildPreviewData()} />
          </div>
        </div>
      </div>
    </div>
  );
}