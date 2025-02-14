import {
  Text,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { logoutAction } from "@/utils/logout";
import { useRouter } from "expo-router";

export default function Profile() {
  console.log("profile page API call");
  const router = useRouter();
  const isAdmin = true;
  const pfpURL = require("@/assets/images/pfp-placeholder.png");
  const name = "Victoria Robertson";

  const handleLogout = async () => {
    const { type, path, message } = await logoutAction();

    if (type === "error") {
      Alert.alert(type, message);
      return;
    }

    Alert.alert(type, message);
    router.replace(path);
  };

  return (
    <SafeAreaView className="relative w-full h-full bg-white">
      <Image
        source={require("@/assets/images/profile-bg.png")}
        className="absolute w-full top-0"
      />
      <View className="flex-row items-center justify-between pt-3 px-5">
        <Text className="text-white text-lg">Settings</Text>
        <Text className="text-3xl text-white font-bold">Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text className="text-white text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
      <View className="items-center mt-[25px]">
        <Image
          source={pfpURL}
          className="aspect-square h-[170px] rounded-full border-2 border-white shadow-xl"
        />
      </View>
      <View className="mt-5 gap-2">
        <Text className="font-bold text-4xl text-center">{name}</Text>
        {isAdmin ? (
          <Text className="text-center font-bold text-2xl">Admin</Text>
        ) : undefined}
      </View>
      <View className="flex-1 bg-gray-100 p-5 mx-4 rounded-xl mt-6 mb-5">
        <Text className="font-bold text-xl">QR Code</Text>
        <View className="items-center justify-center flex-1">
          <Image source={require("@/assets/images/fake-qrcode.png")} />
        </View>
      </View>
      <View className="absolute bottom-0 right-0 bg-[hsla(278,41%,74%,1)] w-1/3 h-[1.5px]" />
    </SafeAreaView>
  );
}
