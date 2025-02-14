import React from "react";
import { View, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface AgendaItemProps {
  start_time: string;
  end_time: string;
  title: string;
  description: string;
  index: number;
}

const formatTimeString = (time_string: string) => {
  return new Date(time_string).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
};

const getStarColor = (index: number) => {
  const colors = ["#C3A0D7", "#9A598A", "#82599A", "#EBCAC6"];
  return colors[index % colors.length];
};

const AgendaItem = ({
  start_time,
  end_time,
  title,
  description,
  index,
}: AgendaItemProps) => {
  const formattedStartTime = formatTimeString(start_time);
  const formattedEndTime = formatTimeString(end_time);
  return (
    <View className="mb-8">
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons
          name="star-four-points"
          size={20}
          color={getStarColor(index)}
        />
        <Text className="text-[#8F9BB3] mb-1">
          {formattedStartTime} - {formattedEndTime}
        </Text>
      </View>
      <View>
        <Text className="text-black text-base font-semibold mb-1">{title}</Text>
        <Text className="text-[#BDBDBD] text-sm">{description}</Text>
      </View>
      <View className="absolute -bottom-4 left-0 right-0 h-[1px] bg-[#E8E8E8]" />
    </View>
  );
};

export default AgendaItem;
