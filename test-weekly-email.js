// Quick test script to trigger the weekly email
// Run this with: node test-weekly-email.js

const SUPABASE_URL = 'https://quvuhzmguvgfcirpauog.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dnVoem1ndXZnZmNpcnBhdW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1NDY1NDcsImV4cCI6MjA3NDEyMjU0N30.K26cnVNBDp6bq0IbPh9WfkTAGnk_TQxeQKlP90IZ47Y';

async function triggerWeeklyEmail() {
  console.log('Triggering weekly email...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/weekly-data-sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Success!');
      console.log('Response:', JSON.stringify(data, null, 2));
      if (data.newCounts) {
        const totalNew = Object.values(data.newCounts).reduce((sum, count) => sum + count, 0);
        console.log(`\n📊 Found ${totalNew} new creators this week`);
        console.log('New creators by platform:', data.newCounts);
      }
      console.log('\n📧 Email sent to alex@creators200.com');
    } else {
      console.error('❌ Error:', data);
    }
  } catch (error) {
    console.error('❌ Failed to trigger email:', error.message);
  }
}

triggerWeeklyEmail();
