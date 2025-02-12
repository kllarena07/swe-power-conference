import { SafeAreaView, View, Text } from "react-native";
import React from "react";
import MessageCard from "@/components/MessageCard";

export default function Messages() {
  return (
    <SafeAreaView className="bg-white h-full">
      <Text className="text-4xl mt-3.5 font-bold text-center">Messages</Text>
      <View className="px-10">
        <MessageCard
          title="Important"
          content="Lunch time has been slightly moved to 2pm"
          time={new Date(new Date().setHours(22, 37, 0))}
        />
      </View>
    </SafeAreaView>
  );
}
