import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function WeeklyRefreshTrigger() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runWeeklyRefresh = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Calling weekly-refresh function...');
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/weekly-refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setResult({ 
        success: response.ok, 
        status: response.status, 
        data 
      });
      
      if (response.ok) {
        console.log('✅ Weekly refresh completed successfully!', data);
      } else {
        console.log('❌ Weekly refresh failed:', data);
      }
    } catch (error) {
      console.error('Error calling weekly refresh:', error);
      setResult({ 
        success: false, 
        error: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-yellow-50 border-yellow-200">
      <h3 className="text-lg font-semibold mb-4">Admin: Weekly Refresh</h3>
      <p className="text-sm text-gray-600 mb-4">
        This will fetch fresh data from Social Blade and populate the cache for all platforms.
      </p>
      
      <Button 
        onClick={runWeeklyRefresh} 
        disabled={loading}
        className="mb-4"
      >
        {loading ? 'Running Refresh...' : 'Run Weekly Refresh'}
      </Button>

      {result && (
        <div className="mt-4 p-4 bg-white rounded border">
          <h4 className="font-semibold mb-2">
            {result.success ? '✅ Success' : '❌ Failed'}
          </h4>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </Card>
  );
}