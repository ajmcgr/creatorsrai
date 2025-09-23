import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Health check endpoint for debugging Social Blade API and environment
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const base = Deno.env.get('SB_BASE_URL');
    const clientId = Deno.env.get('SB_CLIENT_ID');
    const token = Deno.env.get('SB_TOKEN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Test Social Blade API
    const testUrl = `${base}/youtube/top?query=subscribers&page=1`;
    
    try {
      console.log(`Testing Social Blade API: ${testUrl}`);
      const response = await fetch(testUrl, {
        headers: {
          'clientid': clientId!,
          'token': token!
        }
      });

      const ok = response.ok;
      const status = response.status;
      const text = ok ? '' : await response.text().catch(() => '');
      const data = ok ? await response.json().catch(() => null) : null;
      const count = Array.isArray(data) ? data.length : Array.isArray(data?.data) ? data.data.length : 0;

      // Test Supabase connection
      let dbStatus = 'not_configured';
      if (supabaseUrl && serviceKey) {
        try {
          const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
          const { data: testData, error } = await supabase.from('top_cache').select('platform').limit(1);
          dbStatus = error ? `error: ${error.message}` : 'connected';
        } catch (dbError: any) {
          dbStatus = `error: ${dbError.message}`;
        }
      }

      return new Response(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          env: {
            sb_base: !!base,
            sb_client_id: !!clientId,
            sb_token: !!token,
            supabase_url: !!supabaseUrl,
            service_key: !!serviceKey
          },
          socialblade: {
            ok,
            status,
            count,
            error: text || null
          },
          database: {
            status: dbStatus
          }
        }, null, 2),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );

    } catch (sbError: any) {
      return new Response(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          env: {
            sb_base: !!base,
            sb_client_id: !!clientId,
            sb_token: !!token,
            supabase_url: !!supabaseUrl,
            service_key: !!serviceKey
          },
          socialblade: {
            ok: false,
            error: sbError?.message || String(sbError)
          },
          database: {
            status: 'not_tested'
          }
        }, null, 2),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error: any) {
    console.error('Health check error:', error);
    
    return new Response(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        detail: error.message || 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});