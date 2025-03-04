import React, { useState } from "react";
import { View, Text, TextInput, Keyboard, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { signUpAction } from "@/utils/signup";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableOpacityProps,
} from "react-native-gesture-handler";

function SignUpButton(props: TouchableOpacityProps): JSX.Element {
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
      <Text className="text-white text-xl font-bold">Sign Up</Text>
    </TouchableOpacity>
  );
}

function handleRegistrationError(errorMessage: string) {
  Alert.alert(errorMessage);
  console.error("Push notification registration error:", errorMessage);
}

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function Header() {
    return (
      <View className="flex-row justify-between w-full py-3 px-5 items-center">
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="p-2"
          activeOpacity={0.7}
        >
          <MaterialIcons name="close" size={24} color="hsla(0, 0%, 74%, 1)" />
        </TouchableOpacity>
        <Text className="font-bold text-3xl">Sign Up</Text>
        <TouchableOpacity
          onPress={() => router.replace("/login")}
          activeOpacity={0.7}
          className="p-2"
        >
          <Text className="text-rich-plum text-base">Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSignUp = async () => {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const expoPushToken = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      const { type, path, message } = await signUpAction({
        name,
        email,
        password,
        expoPushToken,
      });

      if (type === "error") {
        Alert.alert(type, message);
        return;
      }

      Alert.alert(type, message);
      router.replace(path);
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="items-center h-full">
        <Header />
        <View className="gap-5 w-full px-5 pt-5">
          <TextInput
            className="rounded-lg p-4 bg-light-gray border border-gray-300 text-md"
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Full Name"
            placeholderTextColor="#bdbdbd"
            textAlignVertical="center"
          />

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

          <SignUpButton onPress={handleSignUp} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
