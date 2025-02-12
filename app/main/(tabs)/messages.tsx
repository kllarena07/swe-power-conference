import { SafeAreaView, Text, ScrollView } from "react-native";
import React from "react";
import MessageCard from "@/components/MessageCard";

export default function Messages() {
  return (
    <SafeAreaView className="bg-white h-full">
      <Text className="text-4xl mt-3.5 font-bold text-center">Messages</Text>
      <ScrollView className="px-10">
        {Array.from({ length: 10 }).map((_, index) => (
          <MessageCard
            key={index}
            title="Important"
            content="Lunch time has been slightly moved to 2pm"
            time={new Date(new Date().setHours(22, 37, 0))}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
