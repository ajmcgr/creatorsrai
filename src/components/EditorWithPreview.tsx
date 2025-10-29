import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Plus, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PublicKit from '@/components/kit/PublicKit';
import type { PublicKitData } from '@/types/kit';

interface EditorWithPreviewProps {
  kit: any;
  onSave?: () => void;
}

const templates = [
  { id: 'minimal', name: 'Minimal', colors: { bg: '#ffffff', text: '#111111' } },
  { id: 'editorial', name: 'Editorial', colors: { bg: '#f5f5f0', text: '#2d2d2d' } },
  { id: 'creator-pop', name: 'Creator Pop', colors: { bg: '#ff6b6b', text: '#ffffff' } },
  { id: 'luxury', name: 'Luxury', colors: { bg: '#1a1a1a', text: '#d4af37' } },
  { id: 'neon-glow', name: 'Neon Glow', colors: { bg: '#0a0a0a', text: '#00ff88' } },
  { id: 'nature', name: 'Nature', colors: { bg: '#e8f5e9', text: '#2e7d32' } },
  { id: 'sunset', name: 'Sunset', colors: { bg: '#ff9800', text: '#ffffff' } },
  { id: 'ocean', name: 'Ocean', colors: { bg: '#0288d1', text: '#ffffff' } },
  { id: 'monochrome', name: 'Monochrome', colors: { bg: '#000000', text: '#ffffff' } },
];

const availablePlatforms = ['Instagram', 'YouTube', 'TikTok', 'Twitter/X', 'Facebook', 'LinkedIn', 'Twitch', 'Snapchat', 'Pinterest', 'Threads'];

export function EditorWithPreview({ kit, onSave }: EditorWithPreviewProps) {
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [summary, setSummary] = useState('');
  const [socials, setSocials] = useState<any[]>([]);
  const [rates, setRates] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#111111');
  const [font, setFont] = useState('Inter');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!kit) return;
    
    setEmail(kit.email || '');
    setAvatarUrl(kit.avatar_url || '');
    setBio(kit.bio || '');
    setSummary(kit.summary || '');
    
    // Parse social data
    const socialData = kit.social_data || kit.social_stats || {};
    const parsedSocials = Object.entries(socialData)
      .filter(([_, value]) => value)
      .map(([platform, value]: [string, any]) => ({
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        handle: typeof value === 'string' ? value : (value.handle || value.username || value.id || ''),
        followers: typeof value === 'object' ? (value.followers || value.followerCount || '') : '',
        url: typeof value === 'object' ? value.url : '',
      }));
    setSocials(parsedSocials);
    
    setRates(kit.rates || []);
    setPortfolio(kit.portfolio || []);
    setClients(kit.clients || []);
    
    const theme = kit.custom_styles || {};
    setBackgroundColor(theme.backgroundColor || '#ffffff');
    setTextColor(theme.textColor || '#111111');
    setFont(theme.font || theme.fontFamily || 'Inter');
  }, [kit]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast.success('Photo uploaded!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const addSocial = (platform: string) => {
    if (socials.find(s => s.platform === platform)) {
      toast.error('Platform already added');
      return;
    }
    setSocials([...socials, { platform, handle: '', followers: '', url: '' }]);
  };

  const updateSocial = (index: number, field: string, value: string) => {
    const updated = [...socials];
    updated[index] = { ...updated[index], [field]: value };
    setSocials(updated);
  };

  const removeSocial = (index: number) => {
    setSocials(socials.filter((_, i) => i !== index));
  };

  const addRate = () => {
    setRates([...rates, { label: '', price: '' }]);
  };

  const updateRate = (index: number, field: string, value: string) => {
    const updated = [...rates];
    updated[index] = { ...updated[index], [field]: value };
    setRates(updated);
  };

  const removeRate = (index: number) => {
    setRates(rates.filter((_, i) => i !== index));
  };

  const addPortfolio = () => {
    setPortfolio([...portfolio, { title: '', url: '' }]);
  };

  const updatePortfolio = (index: number, field: string, value: string) => {
    const updated = [...portfolio];
    updated[index] = { ...updated[index], [field]: value };
    setPortfolio(updated);
  };

  const removePortfolio = (index: number) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const addClient = () => {
    setClients([...clients, { name: '' }]);
  };

  const updateClient = (index: number, value: string) => {
    const updated = [...clients];
    updated[index] = { name: value };
    setClients(updated);
  };

  const removeClient = (index: number) => {
    setClients(clients.filter((_, i) => i !== index));
  };

  const applyTemplate = (template: typeof templates[0]) => {
    setBackgroundColor(template.colors.bg);
    setTextColor(template.colors.text);
    toast.success(`${template.name} template applied`);
  };

  const handleSave = async () => {
    if (!kit?.id) return;

    try {
      const socialData: any = {};
      socials.forEach(s => {
        const key = s.platform.toLowerCase().replace(/\//g, '');
        socialData[key] = {
          handle: s.handle,
          username: s.handle,
          followers: s.followers || null,
          url: s.url || `https://${s.platform.toLowerCase()}.com/${s.handle}`,
        };
      });

      const updateData = {
        email,
        avatar_url: avatarUrl,
        bio,
        summary,
        social_data: socialData,
        rates,
        portfolio,
        clients,
        custom_styles: {
          backgroundColor,
          textColor,
          font,
          fontFamily: font,
        }
      };

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

  const buildPreviewData = (): PublicKitData => {
    return {
      id: kit.id,
      name: kit.name || 'Untitled',
      bio: bio,
      avatarUrl: avatarUrl,
      email: email,
      theme: {
        textColor,
        font,
        backgroundMode: 'color',
        backgroundColor,
      },
      socials: socials.map(s => ({
        platform: s.platform.toLowerCase(),
        handle: s.handle,
        url: s.url || `https://${s.platform.toLowerCase()}.com/${s.handle}`,
        followers: s.followers || undefined,
      })),
      sections: [],
      links: portfolio.map(p => ({ title: p.title, url: p.url })),
      rates: rates.map(r => ({ label: r.label, price: r.price })),
      meta: {},
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-[calc(100vh-64px)]">
      {/* Editor Panel */}
      <div className="overflow-y-auto p-8 bg-background border-r">
        <h2 className="text-2xl font-bold mb-8">Edit Media Kit Page</h2>
        
        <div className="space-y-8 max-w-2xl">
          {/* Contact Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          {/* Profile Picture */}
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            {avatarUrl && (
              <div className="flex items-center gap-4">
                <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => document.getElementById('avatar-upload')?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Change Photo'}
            </Button>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Short tagline about you..."
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              placeholder="Longer description about your work and experience..."
            />
            <Button variant="outline" size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Summary
            </Button>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <Label>Social Media Accounts</Label>
            {socials.map((social, index) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">{social.platform}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSocial(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={social.handle}
                    onChange={(e) => updateSocial(index, 'handle', e.target.value)}
                    placeholder="@username or URL"
                  />
                  <div>
                    <Label className="text-xs text-muted-foreground">Manual Follower Count (optional)</Label>
                    <Input
                      type="number"
                      value={social.followers}
                      onChange={(e) => updateSocial(index, 'followers', e.target.value)}
                      placeholder="e.g., 10000"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Use this if automatic data fetch fails</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="flex gap-2">
              <Select onValueChange={addSocial}>
                <SelectTrigger>
                  <SelectValue placeholder="Add Social Platform" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlatforms.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full">
              Auto-Fill My Social Stats
            </Button>
          </div>

          {/* Rates */}
          <div className="space-y-4">
            <Label>Collaboration Rates</Label>
            {rates.map((rate, index) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRate(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={rate.label}
                    onChange={(e) => updateRate(index, 'label', e.target.value)}
                    placeholder="e.g., Instagram Post"
                  />
                  <Input
                    value={rate.price}
                    onChange={(e) => updateRate(index, 'price', e.target.value)}
                    placeholder="e.g., $500"
                  />
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addRate} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Rate
            </Button>
          </div>

          {/* Portfolio */}
          <div className="space-y-4">
            <Label>Portfolio</Label>
            {portfolio.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePortfolio(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={item.title}
                    onChange={(e) => updatePortfolio(index, 'title', e.target.value)}
                    placeholder="Link title"
                  />
                  <Input
                    value={item.url}
                    onChange={(e) => updatePortfolio(index, 'url', e.target.value)}
                    placeholder="https://..."
                  />
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" onClick={addPortfolio} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Portfolio Link
            </Button>
          </div>

          {/* Clients */}
          <div className="space-y-4">
            <Label>Clients</Label>
            <div className="flex flex-wrap gap-2">
              {clients.map((client, index) => (
                <div key={index} className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full">
                  <Input
                    value={client.name}
                    onChange={(e) => updateClient(index, e.target.value)}
                    placeholder="Client name"
                    className="border-0 p-0 h-auto bg-transparent"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => removeClient(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={addClient} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>

          {/* Templates */}
          <div className="space-y-4">
            <Label>Templates</Label>
            <div className="grid grid-cols-3 gap-3">
              {templates.map(template => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => applyTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div
                      className="h-20 rounded mb-2"
                      style={{ backgroundColor: template.colors.bg, border: '1px solid #e5e7eb' }}
                    />
                    <p className="text-sm font-medium text-center">{template.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Colors & Fonts */}
          <div className="space-y-4">
            <Label>Colors & Fonts</Label>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="bgColor" className="text-sm">Background Color</Label>
                <div className="flex gap-2 mt-1">
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
              
              <div>
                <Label htmlFor="txtColor" className="text-sm">Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="txtColor"
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
                <Label htmlFor="font" className="text-sm">Font Family</Label>
                <Select value={font} onValueChange={setFont}>
                  <SelectTrigger id="font" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full" size="lg">
            Save Changes
          </Button>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="bg-muted p-6 overflow-auto">
        <div className="sticky top-6">
          <div className="bg-white rounded-lg shadow-xl mx-auto" style={{ width: 375, maxWidth: '100%' }}>
            <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
              <PublicKit data={buildPreviewData()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
