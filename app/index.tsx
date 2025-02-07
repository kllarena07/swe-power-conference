import { SafeAreaView, StatusBar, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView className="bg-rich-plum flex-1 items-center justify-center text-center">
      <StatusBar barStyle="light-content" />
      <Image
        source={require("@/assets/images/powertitle.png")}
        style={styles.image}
      />

      <Text style={styles.welcome} className="text-center">
        Welcome to UMD'S 2025 Power Conference
      </Text>
      <Text style={styles.subtext} className="text-center">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium
        illum labore at amet dolorum delectus cupiditate vero eveniet,
        distinctio ab quam eum et est voluptate earum optio nostrum eius
        corrupti?
      </Text>

      <Link href="/signup" style={styles.signInButton}>
        <Text style={styles.signInButtonText}>Sign Up</Text>
      </Link>

      <Link href="/login" style={styles.logInButton}>
        <Text style={styles.logInButtonText}>Log In</Text>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcome: {
    color: "#ebcac6",
    fontFamily: "Kurale",
    fontSize: 24,
    width: 333,
    height: 144,
  },
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
