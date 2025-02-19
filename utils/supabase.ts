import "react-native-url-polyfill/auto";
import EncryptedStorage from "react-native-encrypted-storage";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AppState, AppStateStatus } from "react-native";

if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing environment variable: EXPO_PUBLIC_SUPABASE_URL");
}

if (!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing environment variable: EXPO_PUBLIC_SUPABASE_ANON_KEY",
  );
}

const supabaseUrl: string = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey: string = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

interface SecureStorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const secureStorage: SecureStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await EncryptedStorage.getItem(key);
    } catch (error) {
      console.error(`Error retrieving key "${key}":`, error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await EncryptedStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting key "${key}":`, error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      const exists = await EncryptedStorage.getItem(key);
      if (exists) {
        await EncryptedStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing key "${key}":`, error);
      console.warn(`Unable to remove item from secure storage: ${error}`);
    }
  },
};

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: secureStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

AppState.addEventListener("change", (state: AppStateStatus) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
