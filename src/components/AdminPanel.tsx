import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MonthlyRefreshTrigger } from "@/components/MonthlyRefreshTrigger";
import { useToast } from "@/hooks/use-toast";

type Platform = 'youtube' | 'tiktok' | 'instagram';

export function AdminPanel() {
  const [refreshing, setRefreshing] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleAuth = () => {
    // Simple auth check - in production you'd want proper authentication
    if (adminSecret.trim()) {
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "Admin access granted",
      });
    } else {
      toast({
        title: "Error", 
        description: "Admin secret required",
        variant: "destructive",
      });
    }
  };

  const refreshData = async (platforms?: Platform[]) => {
    if (!isAuthenticated) {
      toast({
        title: "Error",
        description: "Authentication required",
        variant: "destructive",
      });
      return;
    }

    setRefreshing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminSecret}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(platforms ? { platforms } : {})
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Successfully refreshed: ${result.refreshed.join(', ')}`,
        });
        // Reload the page to show updated data
        setTimeout(() => window.location.reload(), 1000);
      } else if (response.status === 401) {
        toast({
          title: "Error",
          description: "Invalid admin secret",
          variant: "destructive",
        });
        setIsAuthenticated(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to refresh data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: "Error",
        description: "Error refreshing data",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Admin Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="password"
            placeholder="Enter admin secret"
            value={adminSecret}
            onChange={(e) => setAdminSecret(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
          />
          <Button onClick={handleAuth} className="w-full">
            Authenticate
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Admin Panel - Data Refresh
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <MonthlyRefreshTrigger />
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Monthly Top-200 System:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Data refreshes automatically on the 1st of each month</li>
            <li>• Fetches Top-200 creators from each platform (6 API calls total)</li>
            <li>• Users can paginate through all 200 entries (50 per page)</li>
            <li>• Uses ~120 Social Blade credits per month</li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-800">API Endpoints:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div><Badge variant="secondary">GET</Badge> <code>/functions/v1/social-blade-top?platform=youtube&limit=200</code></div>
            <div><Badge variant="secondary">POST</Badge> <code>/functions/v1/monthly-refresh</code></div>
          </div>
        </div>

        <Button 
          onClick={() => setIsAuthenticated(false)}
          variant="ghost"
          size="sm"
          className="w-full"
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
}