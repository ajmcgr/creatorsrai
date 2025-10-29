import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Instagram, Youtube, Music, Twitter, Facebook, Linkedin, Twitch, Camera, Pin, AtSign } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SocialHandle {
  id: string;
  platform: 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'facebook' | 'linkedin' | 'twitch' | 'snapchat' | 'pinterest' | 'threads';
  username: string;
  followerCount?: number;
  manualEntry?: boolean;
}

interface SocialHandlesInputProps {
  value: SocialHandle[];
  onChange: (handles: SocialHandle[]) => void;
}

const platformConfig = {
  instagram: { icon: Instagram, label: "Instagram", placeholder: "@username or profile URL" },
  youtube: { icon: Youtube, label: "YouTube", placeholder: "@handle or channel URL" },
  tiktok: { icon: Music, label: "TikTok", placeholder: "@username or profile URL" },
  twitter: { icon: Twitter, label: "Twitter/X", placeholder: "@username or profile URL" },
  facebook: { icon: Facebook, label: "Facebook", placeholder: "Username or page URL" },
  linkedin: { icon: Linkedin, label: "LinkedIn", placeholder: "Profile or company URL" },
  twitch: { icon: Twitch, label: "Twitch", placeholder: "@username or channel URL" },
  snapchat: { icon: Camera, label: "Snapchat", placeholder: "@username" },
  pinterest: { icon: Pin, label: "Pinterest", placeholder: "@username or profile URL" },
  threads: { icon: AtSign, label: "Threads", placeholder: "@username" }
};

export function SocialHandlesInput({ value, onChange }: SocialHandlesInputProps) {
  const [newPlatform, setNewPlatform] = useState<SocialHandle['platform']>('instagram');
  const [newUsername, setNewUsername] = useState('');

  const addHandle = () => {
    if (!newUsername.trim()) return;
    
    const newHandle: SocialHandle = {
      id: `${newPlatform}-${Date.now()}`,
      platform: newPlatform,
      username: newUsername.trim()
    };
    
    onChange([...value, newHandle]);
    setNewUsername('');
  };

  const removeHandle = (id: string) => {
    onChange(value.filter(h => h.id !== id));
  };

  const updateHandle = (id: string, username: string) => {
    onChange(value.map(h => h.id === id ? { ...h, username } : h));
  };

  return (
    <div className="space-y-4">
      {/* Existing Handles */}
      {value.map(handle => {
        const config = platformConfig[handle.platform];
        const Icon = config.icon;
        
        return (
          <Card key={handle.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <Label className="text-sm mb-1 block">{config.label}</Label>
                  <Input
                    value={handle.username}
                    onChange={(e) => updateHandle(handle.id, e.target.value)}
                    placeholder={config.placeholder}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHandle(handle.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="ml-9">
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Manual Follower Count (optional)
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={handle.followerCount || ''}
                  onChange={(e) => {
                    const count = e.target.value ? parseInt(e.target.value) : undefined;
                    onChange(value.map(h => 
                      h.id === handle.id 
                        ? { ...h, followerCount: count, manualEntry: count !== undefined } 
                        : h
                    ));
                  }}
                  placeholder="Enter follower count"
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use this if automatic data fetch fails
                </p>
              </div>
            </div>
          </Card>
        );
      })}

      {/* Add New Handle */}
      <Card className="p-4 border-dashed">
        <div className="space-y-3">
          <Label className="text-left text-sm font-medium">Add Social Platform</Label>
          <div className="flex gap-3">
            <select
              value={newPlatform}
              onChange={(e) => setNewPlatform(e.target.value as SocialHandle['platform'])}
              className="p-2 border rounded-md bg-background flex-1 text-sm"
            >
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter/X</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitch">Twitch</option>
              <option value="snapchat">Snapchat</option>
              <option value="pinterest">Pinterest</option>
              <option value="threads">Threads</option>
            </select>
          </div>
          <div className="flex gap-3">
            <Input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={platformConfig[newPlatform].placeholder}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHandle())}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addHandle}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
