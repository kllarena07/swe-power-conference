import { ImageBackground, SafeAreaView, Text, View } from "react-native";
import React from "react";
import { Image } from "react-native";
import { Link } from "expo-router";

export default function Index() {
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

        <View className="w-4/5">
          <Text className="text-center text-[hsla(40,36%,88%,1)] text-3xl font-[Kurale]">
            Welcome to UMD's {"\n"} Power 2025 Conference
          </Text>
          <Text className="text-center text-lg text-[hsla(6,48%,85%,1)] font-[Inter]">
            Rise Together{"\n"}
            Empower Each Other{"\n"}
            Reign as One
          </Text>
        </View>

        <View className="w-4/5 gap-5">
          <Link
            href="/signup"
            className="w-full p-5 bg-[hsla(40,36%,88%,1)] rounded-lg text-[hsla(278,27%,48%,1)] text-center font-bold text-xl"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="w-full p-5 border-4 rounded-lg border-[hsla(40,36%,88%,1)] text-[hsla(40,36%,88%,1)] font-bold text-center text-xl"
          >
            Login
          </Link>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
