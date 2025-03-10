import {
  ImageBackground,
  Text,
  View,
  Platform,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { Link } from "expo-router";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  Alert.alert(errorMessage);
  console.error("Push notification registration error:", errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

export default function Index() {
  useEffect(() => {
    (async () => {
      await registerForPushNotificationsAsync();
    })();
  }, []);

  return (
    <ImageBackground
      source={require("@/assets/images/home-bg.png")}
      className="w-full h-full"
    >
      <SafeAreaView className="h-full items-center justify-center gap-10">
        <Image
          source={require("@/assets/images/powertitle.png")}
          className="w-full h-[200px]"
          resizeMode="contain"
        />

        <View className="w-4/5 gap-5">
          <Text className="text-center text-cream text-3xl font-kurale">
            Welcome to UMD's {"\n"} Power 2025 Conference
          </Text>
          <Text className="text-center text-lg text-light-beige font-[Inter]">
            Rise Together{"\n"}
            Empower Each Other{"\n"}
            Reign as One
          </Text>
        </View>

        <View className="w-4/5 gap-5">
          <Link
            href="/signup"
            className="w-full p-5 bg-cream rounded-lg text-rich-plum text-center font-bold text-xl"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="w-full p-5 border-4 rounded-lg border-cream text-cream font-bold text-center text-xl"
          >
            Login
          </Link>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
