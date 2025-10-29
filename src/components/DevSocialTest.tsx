import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { fetchSocialStats } from "@/lib/fetchSocialStats";
import { toast } from "sonner";

interface TestCase {
  platform: 'instagram' | 'tiktok' | 'youtube';
  input: string;
  label: string;
}

const testCases: TestCase[] = [
  { platform: 'instagram', input: 'natgeo', label: 'IG: natgeo' },
  { platform: 'instagram', input: 'https://instagram.com/natgeo', label: 'IG: URL' },
  { platform: 'instagram', input: '@natgeo', label: 'IG: @handle' },

  { platform: 'tiktok', input: 'charlidamelio', label: 'TT: charlidamelio' },
  { platform: 'tiktok', input: 'https://www.tiktok.com/@charlidamelio', label: 'TT: URL' },
  { platform: 'tiktok', input: '@charlidamelio', label: 'TT: @handle' },

  { platform: 'youtube', input: 'UCX6OQ3DkcsbYNE6H8uQQuVA', label: 'YT: Channel ID' },
  { platform: 'youtube', input: 'https://www.youtube.com/@MrBeast', label: 'YT: @handle URL' },
  { platform: 'youtube', input: '@LinusTechTips', label: 'YT: @handle' },
  { platform: 'youtube', input: 'https://www.youtube.com/user/PewDiePie', label: 'YT: user URL' },
];

export function DevSocialTest() {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});

  const handleTest = async (testCase: TestCase) => {
    const key = `${testCase.platform}:${testCase.input}`;
    setLoading(key);

    try {
      const response = await fetchSocialStats(testCase.platform, testCase.input);

      if (response.ok) {
        setResults(prev => ({
          ...prev,
          [key]: { success: true, data: response.data, source: response.source }
        }));
        toast.success(`✓ ${testCase.label} (${response.source})`);
      } else {
        const errorResponse = response as { ok: false; error: string; reason?: string };
        const isUrl = testCase.input.includes('://');
        const displayError = errorResponse.error === 'HANDLE_NOT_FOUND' && isUrl
          ? 'Profile not found (URL parsed OK)'
          : errorResponse.error;

        setResults(prev => ({
          ...prev,
          [key]: { success: false, error: displayError, reason: errorResponse.reason }
        }));
        toast.error(`✗ ${testCase.label}: ${displayError}`);
      }
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        [key]: { success: false, error: error.message }
      }));
      toast.error(`✗ ${testCase.label}: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  const handleTestAll = async () => {
    for (const tc of testCases) {
      await handleTest(tc);
      await new Promise(resolve => setTimeout(resolve, 500)); // Throttle
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Social Stats Test Harness</h2>
        <Button onClick={handleTestAll} disabled={loading !== null} size="sm">
          Test All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {testCases.map((tc) => {
          const key = `${tc.platform}:${tc.input}`;
          const result = results[key];
          const isLoading = loading === key;

          return (
            <Button
              key={key}
              onClick={() => handleTest(tc)}
              disabled={isLoading}
              variant={result ? (result.success ? "default" : "destructive") : "outline"}
              size="sm"
              className="justify-start text-left h-auto py-2"
            >
              <div className="flex flex-col gap-1 w-full">
                <span className="font-medium">{tc.label}</span>
                {result && (
                  <span className="text-xs opacity-80">
                    {result.success
                      ? `${result.data.followers.toLocaleString()} followers (${result.source})`
                      : result.error
                    }
                  </span>
                )}
                {isLoading && <span className="text-xs">Testing...</span>}
              </div>
            </Button>
          );
        })}
      </div>

      {Object.keys(results).length > 0 && (
        <div className="text-sm text-muted-foreground">
          Tested: {Object.keys(results).length} / {testCases.length} •
          Success: {Object.values(results).filter(r => r.success).length}
        </div>
      )}
    </Card>
  );
}
