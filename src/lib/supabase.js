import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vvrjcflwmaoskxmohegc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2cmpjZmx3bWFvc2t4bW9oZWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MTgxNTgsImV4cCI6MjA4Mjk5NDE1OH0.WP9FX9wxL_S5iQH13zB_EaveBAqoS_bhExlkgwktnbE';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
