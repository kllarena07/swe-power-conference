import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, Pressable } from "react-native";
import { Link } from "expo-router";
// import { MaterialIcons } from '@expo/vector-icons';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {
    // Handle login logic here
  };

  return (
    <SafeAreaView className="items-center justify-center text-center">
      <View className="flex-row left-8 my-2">
        <Text className="font-bold text-3xl mb-5">Log In</Text>
        <Link href="/signup" className="left-24 text-rich-plum text-base">
          Sign Up
        </Link>
      </View>

      <View className="w-4/5 mb-6">
        <TextInput
          className="h-12 rounded-lg p-2.5 bg-light-gray border border-gray-300 text-lg"
          value={username}
          onChangeText={(text) => setUsername(text)}
          placeholder="Username"
          placeholderTextColor="#bdbdbd"
        />
      </View>

      <View className="w-4/5 mb-6">
        <TextInput
          className="h-12 rounded-lg p-2.5 bg-light-gray border border-gray-300 text-lg"
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          placeholderTextColor="#bdbdbd"
          secureTextEntry
        />
      </View>

      <View className="flex-row my-3">
        <Text className="mr-2">Forgot Password?</Text>
        <Text className="text-rich-plum">Reset Here</Text>
      </View>

      <View className="justify-center items-center mb-20">
        <Pressable
          onPress={handleLogin}
          className="items-center justify-center bg-rich-plum h-14 w-96 rounded-lg top-4 p-2"
        >
          <Text className="text-white text-base font-bold">Log In</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
