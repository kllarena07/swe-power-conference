import { Text, SafeAreaView, View, Image } from "react-native";
import React from "react";

export default function Profile() {
  const isAdmin = true;
  const pfpURL = require("@/assets/images/pfp-placeholder.png");
  const name = "Victoria Robertson";

  return (
    <SafeAreaView className="relative w-full h-full bg-white">
      <Image
        source={require("@/assets/images/profile-bg.png")}
        className="absolute w-full top-0"
      />
      <View className="flex-row items-center justify-between pt-3 px-5">
        <Text className="text-white text-lg">Settings</Text>
        <Text className="text-3xl text-white font-bold">Profile</Text>
        <Text className="text-white text-lg">Logout</Text>
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
    </SafeAreaView>
  );
}
