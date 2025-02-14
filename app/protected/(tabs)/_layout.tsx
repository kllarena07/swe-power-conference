import { useEffect, useState } from "react";
import { Tabs, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar, Text } from "react-native";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

export default function TabLayout() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [activeRoute, setActiveRoute] = useState("");

  const getIconColor = (routeName: string) => {
    return activeRoute === routeName
      ? "hsla(278, 41%, 74%, 1)"
      : "hsla(0, 0%, 74%, 1)";
  };

  useEffect(() => {
    // if (!session) {
    //   router.replace("/login");
    // }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      {session && session.user && <Text>{session.user.id}</Text>}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            paddingTop: 12,
            backgroundColor: "hsla(0, 0%, 98%, 1)",
          },
        }}
        screenListeners={{
          state: (e) => {
            const routeName = e.data.state.routes[e.data.state.index].name;

            const theme =
              routeName === "profile" ? "light-content" : "dark-content";

            StatusBar.setBarStyle(theme);
            setActiveRoute(routeName);
          },
        }}
      >
        <Tabs.Screen
          name="messages"
          options={{
            tabBarLabel: "",
            tabBarIcon: () => (
              <MaterialIcons
                name="mail-outline"
                size={32}
                color={getIconColor("messages")}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: "",
            tabBarIcon: () => (
              <MaterialIcons
                name="alarm"
                size={32}
                color={getIconColor("index")}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "",
            tabBarIcon: () => (
              <MaterialIcons
                name="person-outline"
                size={32}
                color={getIconColor("profile")}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
