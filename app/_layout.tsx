import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import "../global.css";
import { StatusBar } from "react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";

export { ErrorBoundary } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Kurale: require("../assets/fonts/Kurale-Regular.ttf"),
    ...FontAwesome.font,
  });

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
        <Stack.Screen name="forgetPassword" options={{ headerShown: false }} />
        <Stack.Screen
          name="(protected)"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
