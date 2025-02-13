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
import { signUpAction, SignUpActionProps } from "@/utils/signup";

function Header() {
  return (
    <View className="flex-row justify-between w-full py-3 px-5 items-center">
      <Link href="/">
        <MaterialIcons name="close" size={24} color="hsla(0, 0%, 74%, 1)" />
      </Link>
      <Text className="font-bold text-3xl">Sign Up</Text>
      <Link href="/login" className="text-rich-plum text-base">
        Login
      </Link>
    </View>
  );
}

type SignUpButtonProps = {
  signUpAction: ({ name, email, password }: SignUpActionProps) => void;
  name: string;
  email: string;
  password: string;
};

function SignUpButton({
  signUpAction,
  name,
  email,
  password,
}: SignUpButtonProps): JSX.Element {
  return (
    <TouchableOpacity
      onPress={() =>
        signUpAction({
          name,
          email,
          password,
        })
      }
      className="w-full items-center justify-center bg-rich-plum rounded-lg py-4"
    >
      <Text className="text-white text-xl font-bold">Sign Up</Text>
    </TouchableOpacity>
  );
}

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="items-center h-full">
        <Header />
        <View className="gap-5 w-full px-5 pt-5">
          <TextInput
            className="rounded-lg p-4 bg-light-gray border border-gray-300 text-lg"
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Full Name"
            placeholderTextColor="#bdbdbd"
            textAlignVertical="center"
          />

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

          <SignUpButton
            signUpAction={signUpAction}
            name={name}
            email={email}
            password={password}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
