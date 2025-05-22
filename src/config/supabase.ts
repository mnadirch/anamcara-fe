import { createClient } from "@supabase/supabase-js";

// const options = {
//   auth: {
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false
//   }
// } as const;

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  // options
);

export default supabase;
