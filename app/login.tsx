import React, { useState } from "react";
import { View, Text, TextInput, Keyboard } from "react-native";
import { Link, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
// import { useAuth } from "@/context/AuthContext";
import * as Linking from "expo-linking";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableOpacityProps,
} from "react-native-gesture-handler";

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

function LoginButton(props: TouchableOpacityProps): JSX.Element {
  return (
    <TouchableOpacity
      {...props}
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#82599a",
        borderRadius: 10,
        paddingVertical: 16,
      }}
    >
      <Text className="text-white text-xl font-bold">Login</Text>
    </TouchableOpacity>
  );
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // const { onLogin } = useAuth();

  const handleLogin = async () => {
    // const { type, path, message } = await onLogin!(email, password);

    // if (type === "error") {
    //   Alert.alert(type, message);
    //   return;
    // }

    // router.replace(path);
    router.replace("/(protected)/");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="items-center h-full">
        <Header />
        <View className="gap-5 w-full px-5 pt-5">
          <TextInput
            className="rounded-lg p-4 bg-light-gray border border-gray-300 text-md"
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            placeholderTextColor="#bdbdbd"
            textAlignVertical="center"
          />

          <View className="flex flex-row relative">
            <TextInput
              className="grow rounded-l-lg p-4 bg-light-gray border border-gray-300 border-r-0 text-md"
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Password"
              placeholderTextColor="#bdbdbd"
              secureTextEntry={!isPasswordVisible}
              textAlignVertical="center"
            />
            <View className="grow-0 justify-center bg-light-gray pr-2 border-gray-300 border border-l-0 rounded-r-lg">
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <MaterialIcons
                  name={isPasswordVisible ? "visibility" : "visibility-off"}
                  size={24}
                  color="hsla(0, 0%, 74%, 1)"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="opacity-50 flex flex-row justify-center gap-1">
            <Text className="text-center">Forgot Password?</Text>
            <TouchableOpacity
              className="items-center justify-center"
              onPress={() =>
                Linking.openURL(
                  "https://power-reset-password.vercel.app/forgot-password"
                )
              }
            >
              <Text className="text-rich-plum">Reset Here</Text>
            </TouchableOpacity>
          </View>
          <LoginButton onPress={handleLogin} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
