import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingTop: 12,
          backgroundColor: "hsla(0, 0%, 98%, 1)",
        },
      }}
    >
      {/* <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "",
        }}
      /> */}
      <Tabs.Screen
        name="messages"
        options={{
          tabBarLabel: "",
          tabBarIcon: () => (
            <MaterialIcons
              name="mail-outline"
              size={32}
              color="hsla(278, 41%, 74%, 1)"
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
              color="hsla(278, 41%, 74%, 1)"
            />
          ),
        }}
      />
    </Tabs>
  );
}
