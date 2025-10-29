import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://owahoewxipxhlbmfykmf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93YWhvZXd4aXB4aGxibWZ5a21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwODM4ODQsImV4cCI6MjA3NTY1OTg4NH0.sIf5bHq0atm2X5ipX8Udms94AR0-VnkJeXKH86juDkI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
