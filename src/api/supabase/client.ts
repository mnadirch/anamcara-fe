import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://wppxoslslgwovvpyldjy.supabase.co',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwcHhvc2xzbGd3b3Z2cHlsZGp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMTczMDIsImV4cCI6MjA2MDc5MzMwMn0.60PIkRWanylc8vBcwOfKtggoyklqZOmrqeFOvUp_gZA");

export default supabase;