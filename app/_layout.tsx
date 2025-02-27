import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "../global.css";
import { StatusBar } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AppSplashScreen from "@/components/SplashScreen";

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
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
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle navigation based on auth state
  useEffect(() => {
    // Skip navigation if not initialized yet or auth status is still initializing
    if (!isInitialized || authStatus === "initializing") return;

    const inAuthGroup = segments[0] === "(protected)";

    if (authStatus === "unauthenticated" && inAuthGroup) {
      console.log("Not authorized!", segments);
      router.replace("/login");
    } else if (authStatus === "authenticated" && !inAuthGroup) {
      console.log("Authorized", segments);
      router.replace("/(protected)");
    }
  }, [authStatus, segments, isInitialized]);

  // Function to handle when initialization is complete
  const handleInitializationComplete = () => {
    console.log("App initialization complete, auth state:", authStatus);
    setIsInitialized(true);
  };

  // Show splash screen until initialization is complete
  if (!isInitialized) {
    return (
      <AppSplashScreen
        onInitializationComplete={handleInitializationComplete}
      />
    );
  }

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
