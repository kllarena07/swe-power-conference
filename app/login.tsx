import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

function Header() {
  return (
    <View className="flex-row justify-between w-full py-3 px-5 items-center">
      <Link href="/">
        <MaterialIcons name="close" size={24} color="hsla(0, 0%, 74%, 1)" />
      </Link>
      <Text className="font-bold text-3xl">Login</Text>
      <Link href="/signup" className="text-rich-plum text-base">
        Sign Up
      </Link>
    </View>
  );
}

function LoginButton({
  handleLogin,
}: {
  handleLogin: () => void;
}): JSX.Element {
  return (
    <TouchableOpacity
      onPress={handleLogin}
      className="w-full items-center justify-center bg-rich-plum rounded-lg py-4"
    >
      <Text className="text-white text-xl font-bold">Login</Text>
    </TouchableOpacity>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {
    // Handle login logic here
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="items-center h-full">
        <Header />
        <View className="gap-5 w-full px-5 pt-5">
          <TextInput
            className="rounded-lg p-4 bg-light-gray border border-gray-300 text-lg"
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            placeholderTextColor="#bdbdbd"
            textAlignVertical="center"
          />

          <View className="relative">
            <TextInput
              className="rounded-lg p-4 bg-light-gray border border-gray-300 text-lg pr-12"
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Password"
              placeholderTextColor="#bdbdbd"
              secureTextEntry={!isPasswordVisible}
              textAlignVertical="center"
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-4 top-5"
            >
              <MaterialIcons
                name={isPasswordVisible ? "visibility" : "visibility-off"}
                size={24}
                color="hsla(0, 0%, 74%, 1)"
              />
            </TouchableOpacity>
          </View>

          <View className="opacity-50">
            <Text className="text-center">
              Forgot Password?{" "}
              <Link href="/" className="text-rich-plum">
                Reset Here
              </Link>
            </Text>
          </View>
          <LoginButton handleLogin={handleLogin} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
