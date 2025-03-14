import { Text, View, Image, Alert } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import QRCode from "react-qr-code";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { deleteUserAccount } from "@/utils/delete-account";

export default function Profile() {
  const { onLogout, profileData } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const { type, path, message } = await onLogout!();

    if (type === "error") {
      Alert.alert(type, message);
      return;
    }

    Alert.alert(type, message);
    router.replace(path);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { success, message } = await deleteUserAccount();

            if (success) {
              await onLogout!();
            } else {
              Alert.alert("Error", message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="relative w-full h-full bg-white">
      <Image
        source={require("@/assets/images/profile-bg.png")}
        className="absolute w-full top-0"
      />
      <View className="flex-row items-center justify-between pt-3 px-5">
        <TouchableOpacity onPress={handleDeleteAccount}>
          <Text className="text-white text-lg">Delete</Text>
        </TouchableOpacity>
        <Text className="text-3xl text-white font-bold">Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text className="text-white text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
      <View className="items-center mt-[25px]">
        <Image
          source={require("@/assets/images/swe-logo.png")}
          className="aspect-square h-[200px] rounded-full"
        />
      </View>
      <View className="mt-5 gap-2">
        <Text className="font-bold text-4xl text-center">
          {profileData?.name}
          {profileData?.is_admin ? " (Admin)" : ""}
        </Text>
        <Text className="font-bold text-2xl text-center">
          {profileData?.checked_in ? "Checked-In ✅" : "Not Checked-In ❌"}
        </Text>
      </View>
      <View className="flex-1 bg-gray-100 mx-5 rounded-xl mt-6 mb-5">
        <View className="items-center justify-center flex-1">
          {profileData ? (
            <QRCode value={profileData.user_id} />
          ) : (
            <Text>Error pulling profile data.</Text>
          )}
        </View>
      </View>
      <View
        className={`absolute bottom-0 ${
          profileData?.is_admin ? "right-[40%]" : "right-0"
        } bg-[hsla(278,41%,74%,1)] ${
          profileData?.is_admin ? "w-1/5" : "w-1/3"
        } h-[1.5px]`}
      />
    </SafeAreaView>
  );
}
