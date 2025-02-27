import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "../global.css";
import { StatusBar } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";

export { ErrorBoundary } from "expo-router";

import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Kurale: require("../assets/fonts/Kurale-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}

function StackLayout() {
  const { authStatus } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const currentRoute = usePathname();

  // Handle navigation based on auth state
  useEffect(() => {
    const inAuthGroup = segments[0] === "(protected)";

    if (authStatus === "unauthenticated" && inAuthGroup) {
      console.log("Not authorized!", segments);
      router.replace("/login");
    } else if (authStatus === "authenticated" && !inAuthGroup) {
      console.log("Authorized", segments);
      router.replace("/(protected)");
    }
  }, [authStatus, segments]);

  return (
    <>
      <StatusBar
        barStyle={
          currentRoute === "/" && segments[0] !== "(protected)"
            ? "light-content"
            : "dark-content"
        }
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
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
      </GestureHandlerRootView>
    </>
  );
}
