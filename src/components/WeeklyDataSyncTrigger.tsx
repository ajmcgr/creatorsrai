import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const WeeklyDataSyncTrigger = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  const triggerSync = async () => {
    setIsSyncing(true);
    try {
      console.log('Triggering weekly data sync...');
      
      const { data, error } = await supabase.functions.invoke('weekly-data-sync');
      
      if (error) {
        throw error;
      }
      
      console.log('Weekly sync response:', data);
      
      if (data?.ok) {
        const totalNew = Object.values(data.newCounts || {}).reduce((sum: number, count) => sum + (count as number), 0);
        toast.success(`Weekly sync completed! ${totalNew} new creators found. Email sent to alex@creators200.com.`);
      } else {
        toast.success('Weekly sync triggered successfully!');
      }
      
    } catch (error: any) {
      console.error('Weekly sync error:', error);
      toast.error(`Weekly sync failed: ${error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="mb-4 p-4 bg-card border rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Weekly Data Sync & Email</h3>
          <p className="text-sm text-muted-foreground">
            Sends weekly new creators email to alex@creators200.com (runs automatically every Monday at 9 AM UTC)
          </p>
        </div>
        <Button 
          onClick={triggerSync} 
          disabled={isSyncing}
          variant="outline"
        >
          {isSyncing ? 'Syncing...' : 'Test Now'}
        </Button>
      </div>
    </div>
  );
};
