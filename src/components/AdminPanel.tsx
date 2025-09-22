import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw } from "lucide-react";

export const AdminPanel = () => {
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    if (!secret.trim()) {
      toast({
        title: "Error",
        description: "Please enter the admin secret",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('refresh-weekly', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${secret}`
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Data refreshed successfully for week ${data.week_start}`,
      });
      
      // Clear the secret after successful refresh
      setSecret("");
      
      // Reload the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: "Error",
        description: "Failed to refresh data. Please check your secret.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Admin Panel
        </CardTitle>
        <CardDescription>
          Refresh leaderboard data manually
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="secret" className="text-sm font-medium">
            Admin Secret
          </label>
          <Input
            id="secret"
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter admin secret"
            disabled={loading}
          />
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={loading || !secret.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};