import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const MonthlyRefreshTrigger = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const triggerRefresh = async () => {
    setIsRefreshing(true);
    try {
      console.log('Triggering monthly Top-200 refresh...');
      
      const { data, error } = await supabase.functions.invoke('monthly-refresh');
      
      if (error) {
        throw error;
      }
      
      console.log('Monthly refresh response:', data);
      
      if (data?.results) {
        const successCount = Object.values(data.results).filter(r => r === 'ok').length;
        toast.success(`Monthly refresh completed! ${successCount}/3 platforms updated successfully.`);
      } else {
        toast.success('Monthly refresh triggered successfully!');
      }
      
    } catch (error: any) {
      console.error('Monthly refresh error:', error);
      toast.error(`Monthly refresh failed: ${error.message}`);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="mb-4 p-4 bg-card border rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Monthly Top-200 Refresh</h3>
          <p className="text-sm text-muted-foreground">
            Manually trigger monthly refresh of Top-200 data for all platforms
          </p>
        </div>
        <Button 
          onClick={triggerRefresh} 
          disabled={isRefreshing}
          variant="outline"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
        </Button>
      </div>
    </div>
  );
};