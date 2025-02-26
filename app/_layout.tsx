import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";
import "react-native-gesture-handler";

import "../global.css";
import { StatusBar } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}

function StackLayout() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const currentRoute = usePathname();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(protected)";

    if (!user && inAuthGroup) {
      console.log("Not authorized!", segments);
      router.replace("/login");
    } else if (user && !inAuthGroup) {
      console.log("Authorized", segments);
      router.replace("/(protected)");
    }
  }, [user, segments]);

  return (
    <>
      <StatusBar
        barStyle={
          currentRoute === "/" && segments[0] !== "(protected)"
            ? "light-content"
            : "dark-content"
        }
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
