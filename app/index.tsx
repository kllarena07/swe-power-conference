import { SafeAreaView, Text, View } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView className="bg-rich-plum h-full flex gap-2">
      <View className="flex items-center px-5 text-center">
        <View>
          <Image source={require("@/assets/images/powertitle.png")} />
        </View>

        <View>
          <Text className="text-center text-[#ebcac6] text-3xl font-[Kurale]">
            Welcome to UMD'S {"\n"} 2025 Power Conference
          </Text>

          <Text className="text-center text-[hsla(6,48%,85%,1)]">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Praesentium illum labore at amet dolorum delectus cupiditate vero
            eveniet, distinctio ab quam eum et est voluptate earum optio nostrum
            eius corrupti?
          </Text>
        </View>

        <View className="w-full gap-5">
          <Link
            href="/signup"
            className="p-5 bg-[hsla(40,36%,88%,1)] rounded-lg text-[hsla(278,27%,48%,1)] text-center font-bold"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="p-5 border-4 rounded-lg border-[hsla(40,36%,88%,1)] text-[hsla(40,36%,88%,1)] font-bold text-center"
          >
            Login
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  subtext: {
    color: "#ebcac6",
    fontFamily: "Kurale",
    fontSize: 14,
    width: 290,
    height: 89,
    top: -50,
  },
  image: {
    width: 367,
    height: 186,
  },
  signInButton: {
    backgroundColor: "#ece5d7",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: 309,
    height: 51,
    justifyContent: "center",
    transform: [{ translateY: -10 }],
  },
  signInButtonText: {
    color: "#82599a",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  logInButton: {
    backgroundColor: "#82599a",
    padding: 10,
    borderRadius: 5,
    borderColor: "#ece5d7",
    borderWidth: 1,
    marginTop: 10,
    width: 309,
    height: 51,
    justifyContent: "center",
    transform: [{ translateY: -10 }],
  },
  logInButtonText: {
    color: "#ece5d7",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
