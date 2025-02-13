import React from "react";
import { View, Text } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface AgendaItemProps {
    time: string;
    title: string;
    description: string;
}

const AgendaItem = ({ time, title, description }: AgendaItemProps) => (
  <View className="mb-8">
    <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons name="star-four-points" size={20} color="#C3A0D7" />
        <Text className="text-[#8F9BB3] mb-1">{time}</Text>
    </View>
    <View>
      <Text className="text-black text-base font-semibold mb-1">{title}</Text>
      <Text className="text-[#BDBDBD] text-sm">{description}</Text>
    </View>
    <View className="absolute -bottom-4 left-0 right-0 h-[1px] bg-[#E8E8E8]" />
  </View >
);

export default AgendaItem;