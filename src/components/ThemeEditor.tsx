import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Undo2, Redo2, RotateCcw, AlertCircle } from 'lucide-react';
import { Theme, checkContrast } from '@/lib/themeUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ThemeEditorProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
  saving?: boolean;
  hasUnsavedChanges?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onReset?: () => void;
  onRevert?: () => void;
  lastSaved?: Date | null;
}

export function ThemeEditor({
  theme,
  onChange,
  saving,
  hasUnsavedChanges,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onRevert,
  lastSaved
}: ThemeEditorProps) {
  const contrast = checkContrast(theme);
  
  const update = (partial: Partial<Theme>) => {
    onChange({ ...theme, ...partial });
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Theme Settings</h3>
        <div className="flex items-center gap-2">
          {saving && <span className="text-sm text-muted-foreground">Saving...</span>}
          {!saving && lastSaved && (
            <span className="text-xs text-muted-foreground">
              Saved {new Date(lastSaved).toLocaleTimeString()}
            </span>
          )}
          <Button size="sm" variant="ghost" onClick={onUndo} disabled={!canUndo}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onRedo} disabled={!canRedo}>
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          {hasUnsavedChanges && (
            <Button size="sm" variant="outline" onClick={onRevert}>
              Revert
            </Button>
          )}
        </div>
      </div>

      {/* Contrast warning */}
      {!contrast.pass && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Poor contrast ({contrast.ratio.toFixed(2)}:1). WCAG AA requires 4.5:1 minimum.
          </AlertDescription>
        </Alert>
      )}

      {/* Colors */}
      <Card className="p-4 space-y-4">
        <h4 className="font-medium">Colors</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">Card Background</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                type="color"
                value={theme.card_bg}
                onChange={(e) => update({ card_bg: e.target.value })}
                className="w-16 h-9"
              />
              <Input
                type="text"
                value={theme.card_bg}
                onChange={(e) => update({ card_bg: e.target.value })}
                className="flex-1 text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm">Border Color</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                type="color"
                value={theme.card_border_color}
                onChange={(e) => update({ card_border_color: e.target.value })}
                className="w-16 h-9"
              />
              <Input
                type="text"
                value={theme.card_border_color}
                onChange={(e) => update({ card_border_color: e.target.value })}
                className="flex-1 text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm">Content Color</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                type="color"
                value={theme.content_color}
                onChange={(e) => update({ content_color: e.target.value })}
                className="w-16 h-9"
              />
              <Input
                type="text"
                value={theme.content_color}
                onChange={(e) => update({ content_color: e.target.value })}
                className="flex-1 text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm">Accent Color</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                type="color"
                value={theme.accent}
                onChange={(e) => update({ accent: e.target.value })}
                className="w-16 h-9"
              />
              <Input
                type="text"
                value={theme.accent}
                onChange={(e) => update({ accent: e.target.value })}
                className="flex-1 text-sm"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Typography */}
      <Card className="p-4 space-y-4">
        <h4 className="font-medium">Typography</h4>
        
        <div>
          <Label className="text-sm">Font Family</Label>
          <Select value={theme.font_family} onValueChange={(v) => update({ font_family: v })}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter (Modern)</SelectItem>
              <SelectItem value="Georgia">Georgia (Serif)</SelectItem>
              <SelectItem value="Playfair Display">Playfair Display (Elegant)</SelectItem>
              <SelectItem value="Roboto">Roboto (Clean)</SelectItem>
              <SelectItem value="Montserrat">Montserrat (Bold)</SelectItem>
              <SelectItem value="Poppins">Poppins (Friendly)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm">Heading Weight</Label>
          <Select value={theme.heading_weight} onValueChange={(v) => update({ heading_weight: v })}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="400">Normal (400)</SelectItem>
              <SelectItem value="500">Medium (500)</SelectItem>
              <SelectItem value="600">Semibold (600)</SelectItem>
              <SelectItem value="700">Bold (700)</SelectItem>
              <SelectItem value="800">Extrabold (800)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm">Link Decoration</Label>
          <Select value={theme.link_decoration} onValueChange={(v) => update({ link_decoration: v })}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="underline">Underline</SelectItem>
              <SelectItem value="underline-offset-4">Underline (Offset)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Layout */}
      <Card className="p-4 space-y-4">
        <h4 className="font-medium">Layout</h4>
        
        <div>
          <Label className="text-sm">Border Radius</Label>
          <div className="flex items-center gap-4 mt-1.5">
            <Slider
              value={[parseFloat(theme.card_radius)]}
              onValueChange={(v) => update({ card_radius: `${v[0]}rem` })}
              min={0}
              max={2}
              step={0.25}
              className="flex-1"
            />
            <span className="text-sm w-16 text-right">{theme.card_radius}</span>
          </div>
        </div>

        <div>
          <Label className="text-sm">Layout Density</Label>
          <Select value={theme.layout_density} onValueChange={(v: any) => update({ layout_density: v })}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="spacious">Spacious</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm">Card Shadow</Label>
          <Switch
            checked={theme.card_shadow}
            onCheckedChange={(v) => update({ card_shadow: v })}
          />
        </div>
      </Card>

      {/* Styles */}
      <Card className="p-4 space-y-4">
        <h4 className="font-medium">Component Styles</h4>
        
        <div>
          <Label className="text-sm">Badge Style</Label>
          <Select value={theme.badge_style} onValueChange={(v: any) => update({ badge_style: v })}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="subtle">Subtle</SelectItem>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm">Button Style</Label>
          <Select value={theme.button_style} onValueChange={(v: any) => update({ button_style: v })}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
    </div>
  );
}
