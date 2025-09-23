// Test script to run weekly refresh
const SUPABASE_URL = "https://quvuhzmguvgfcirpauog.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dnVoem1ndXZnZmNpcnBhdW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDY1NDcsImV4cCI6MjA3NDEyMjU0N30.K26cnVNBDp6bq0IbPh9WfkTAGnk_TQxeQKlP90IZ47Y";

async function runWeeklyRefresh() {
  console.log('Calling weekly-refresh function...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/weekly-refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    console.log('Weekly refresh result:', result);
    
    if (response.ok) {
      console.log('✅ Weekly refresh completed successfully!');
    } else {
      console.log('❌ Weekly refresh failed:', result);
    }
  } catch (error) {
    console.error('Error calling weekly refresh:', error);
  }
}

runWeeklyRefresh();