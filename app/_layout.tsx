import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import "../global.css";
import { usePathname } from "expo-router";
import { StatusBar, Text } from "react-native";
// import { AuthProvider } from "@/context/AuthContext";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

export { ErrorBoundary } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Kurale: require("../assets/fonts/Kurale-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [session, setSession] = useState<Session | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session && session.user && segments[0] === "(protected)") {
      console.log(session.user);
      router.replace("/");
    } else if (session && session.user) {
      console.log(session.user);
      router.replace("/(protected)");
    } else if (segments[0] === "(protected)") {
      router.replace("/login");
    }
  }, [session, router, segments]);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <StackLayout />;
}

function StackLayout() {
  const currentRoute = usePathname();
  return (
    <>
      <StatusBar
        barStyle={currentRoute === "/" ? "light-content" : "dark-content"}
      />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen
          name="(protected)"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
