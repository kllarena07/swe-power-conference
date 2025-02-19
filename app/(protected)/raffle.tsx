import { ProfileData, useAuth } from "@/context/AuthContext";
import { sendPushNotification } from "@/utils/push-notif";
import { supabase } from "@/utils/supabase";
import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function Raffle() {
  const [winner, setWinner] = useState<ProfileData["name"]>("");
  const { accessToken } = useAuth();

  const runRaffle = async () => {
    console.log("Running raffle...");
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("name, points");

    if (error) {
      console.error("Error fetching profiles:", error);
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.log("No profiles found.");
      return;
    }

    const totalPoints = profiles.reduce(
      (total, profile) => total + profile.points,
      0
    );

    const randomPoint = Math.random() * totalPoints;

    let cumulative = 0;
    for (const profile of profiles) {
      cumulative += profile.points;
      if (randomPoint < cumulative) {
        setWinner(profile.name);

        try {
          const response = await sendPushNotification({
            subject: "Congratulations! 🥳",
            message: "You've WON the SWE 2025 POWER Conference raffle",
            accessToken: accessToken,
          });

          if (!response.ok) {
            Alert.alert("Error selecting raffle winner", response.statusText);
          }
        } catch (err: any) {
          Alert.alert("Error selecting raffle winner", err);
        }
      }
    }
  };

  return (
    <SafeAreaView className="h-full flex justify-center items-center gap-5">
      <Text className="text-3xl font-bold">Raffle Page</Text>
      <TouchableOpacity className="bg-black p-5 rounded-md" onPress={runRaffle}>
        <Text className="text-white font-bold">Draw Winner</Text>
      </TouchableOpacity>
      <Text className="text-lg">The winner is: {winner}</Text>
      <View className="absolute bottom-0 right-0 bg-[hsla(278,41%,74%,1)] w-1/5 h-[1.5px]" />
    </SafeAreaView>
  );
}
