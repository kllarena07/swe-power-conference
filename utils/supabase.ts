import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ffzljrapzzjpcjsfupeh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmemxqcmFwenpqcGNqc2Z1cGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0NzgwMDUsImV4cCI6MjA0ODA1NDAwNX0.Zbq6AedhycvoEVsmXZpnLIrcaqeYMx46CVpEMoHksrw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
