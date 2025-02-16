import {
  Text,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";

type ProfileData = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  points: number;
  checked_in: boolean;
  is_admin: boolean;
  expo_push_token: string;
  user_id: string;
};

export default function Profile() {
  const { onLogout, user } = useAuth();

  const router = useRouter();
  const pfpURL = require("@/assets/images/pfp-placeholder.png");

  const [profileData, setProfileData] = useState<ProfileData | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfileData(data);
      }
    };
    fetchProfileData();

    const channel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setProfileData(payload.new as ProfileData);
          }
        }
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };
  }, [user?.id]);

  const handleLogout = async () => {
    const { type, path, message } = await onLogout!();

    if (type === "error") {
      Alert.alert(type, message);
      return;
    }

    Alert.alert(type, message);
    router.replace(path);
  };

  return (
    <SafeAreaView className="relative w-full h-full bg-white">
      <Image
        source={require("@/assets/images/profile-bg.png")}
        className="absolute w-full top-0"
      />
      <View className="flex-row items-center justify-between pt-3 px-5">
        <Text className="text-white text-lg">Settings</Text>
        <Text className="text-3xl text-white font-bold">Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text className="text-white text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
      <View className="items-center mt-[25px]">
        <Image
          source={pfpURL}
          className="aspect-square h-[170px] rounded-full border-2 border-white shadow-xl"
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
      <View className="flex-1 bg-gray-100 p-5 mx-4 rounded-xl mt-6 mb-5">
        <Text className="font-bold text-xl">QR Code</Text>
        <View className="items-center justify-center flex-1">
          <Image source={require("@/assets/images/fake-qrcode.png")} />
        </View>
      </View>
      <View className="absolute bottom-0 right-0 bg-[hsla(278,41%,74%,1)] w-1/3 h-[1.5px]" />
    </SafeAreaView>
  );
}
