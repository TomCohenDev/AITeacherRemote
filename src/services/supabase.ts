import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://ptgveftlpeyaqnbvcziv.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Z3ZlZnRscGV5YXFuYnZjeml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNTAzMzUsImV4cCI6MjA3NDkyNjMzNX0.X4ozAZSA4rTZC2p6EsFhTvXT9iVGIrV7QcnJPHCdsrk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
