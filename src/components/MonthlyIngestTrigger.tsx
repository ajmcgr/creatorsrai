import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const MonthlyIngestTrigger = () => {
  const [isRunning, setIsRunning] = useState(false);

  const triggerIngest = async () => {
    setIsRunning(true);
    try {
      console.log('Triggering monthly ingest...');
      
      const { data, error } = await supabase.functions.invoke('weekly-ingest');
      
      if (error) {
        throw error;
      }
      
      console.log('Monthly ingest response:', data);
      
      if (data?.success) {
        const totalNew = data.total_new || 0;
        toast.success(`Monthly ingest completed! ${totalNew} new creators found across all platforms.`);
        
        // Auto-trigger email after successful ingest
        console.log('Auto-triggering email...');
        const { error: emailError } = await supabase.functions.invoke('email-monthly-new', {
          body: { to: 'alex@creators200.com' }
        });
        
        if (emailError) {
          console.error('Email trigger failed:', emailError);
          toast.warning('Data ingested but email failed. Check logs.');
        } else {
          toast.success('Email sent successfully!');
        }
      } else {
        toast.error('Monthly ingest failed. Check logs.');
      }
      
    } catch (error: any) {
      console.error('Monthly ingest error:', error);
      toast.error(`Monthly ingest failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-green-800">🎯 Monthly New Creators Tracker</h3>
          <p className="text-sm text-green-700">
            Runs first Monday of each month - Fetches Top 200 for all platforms (6 API credits), finds new entries, and emails the results
          </p>
        </div>
        <Button 
          onClick={triggerIngest} 
          disabled={isRunning}
          className="bg-green-600 hover:bg-green-700"
        >
          {isRunning ? 'Running...' : 'Run Monthly Ingest'}
        </Button>
      </div>
    </div>
  );
};
