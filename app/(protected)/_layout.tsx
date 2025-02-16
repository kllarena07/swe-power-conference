import { useState } from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function TabLayout() {
  const [activeRoute, setActiveRoute] = useState("");
  const { user } = useAuth();

  if (!user) return;

  const getIconColor = (routeName: string) => {
    return activeRoute === routeName
      ? "hsla(278, 41%, 74%, 1)"
      : "hsla(0, 0%, 74%, 1)";
  };

  return (
    <>
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
