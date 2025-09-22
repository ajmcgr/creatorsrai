import { supabase } from "@/integrations/supabase/client";

export const refreshLeaderboardData = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('refresh-weekly', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 9f2e8a7b6c3d4e5f1a2b8c9d0e7f3g4h'
      }
    });

    if (error) throw error;

    console.log('Data refreshed successfully:', data);
    return data;
  } catch (error) {
    console.error('Refresh error:', error);
    throw error;
  }
};

// Auto-trigger refresh on load if no data exists
refreshLeaderboardData().catch(console.error);