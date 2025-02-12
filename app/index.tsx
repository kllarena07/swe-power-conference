import { SafeAreaView, Text } from "react-native";
// import { View } from "react-native";
import React from "react";
// import { StyleSheet } from "react-native";
import { Image } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView className="bg-rich-plum h-full items-center flex gap-2">
      <Image source={require("@/assets/images/powertitle.png")} width={300} />
      <Text className="text-center text-[hsla(40,36%,88%,1)] text-3xl font-[Kurale]">
        Welcome to UMD'S {"\n"} 2025 Power Conference
      </Text>

      <Text className="text-center text-[hsla(6,48%,85%,1)] font-[Inter]">
        Lorem ipsum dolor sit amet, consectetuer dolor adipiscing elit, sed
        dolor. Lorem ipsum dolor sit amet, consectetuer dolor adipiscing elit,
        sed dolor
      </Text>
      <Link
        href="/signup"
        className="p-5 bg-[hsla(40,36%,88%,1)] rounded-lg text-[hsla(278,27%,48%,1)] text-center font-bold text-xl"
      >
        Sign Up
      </Link>
      <Link href="/main/(tabs)/messages">Messages</Link>
      <Link
        href="/login"
        className="p-5 border-4 rounded-lg border-[hsla(40,36%,88%,1)] text-[hsla(40,36%,88%,1)] font-bold text-center text-xl"
      >
        Login
      </Link>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   subtext: {
//     color: "#ebcac6",
//     fontFamily: "Kurale",
//     fontSize: 14,
//     width: 290,
//     height: 89,
//     top: -50,
//   },
//   image: {
//     width: 367,
//     height: 186,
//   },
//   signInButton: {
//     backgroundColor: "#ece5d7",
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     width: 309,
//     height: 51,
//     justifyContent: "center",
//     transform: [{ translateY: -10 }],
//   },
//   signInButtonText: {
//     color: "#82599a",
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   logInButton: {
//     backgroundColor: "#82599a",
//     padding: 10,
//     borderRadius: 5,
//     borderColor: "#ece5d7",
//     borderWidth: 1,
//     marginTop: 10,
//     width: 309,
//     height: 51,
//     justifyContent: "center",
//     transform: [{ translateY: -10 }],
//   },
//   logInButtonText: {
//     color: "#ece5d7",
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
// });
