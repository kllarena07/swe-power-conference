import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";

export default function MessageCard({
  title,
  content,
  time,
}: {
  title: string;
  content: string;
  time: Date;
}) {
  const [timeDifference, setTimeDifference] = useState(
    Math.round((new Date().getTime() - time.getTime()) / 60000)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeDifference(
        Math.round((new Date().getTime() - time.getTime()) / 60000)
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <View className="gap-2">
      <View className="flex flex-row justify-between items-center">
        <Text className="font-bold text-xl">{title}</Text>
        <Text className="text-[hsla(0,0%,74%,1)]">{timeDifference}m ago</Text>
      </View>
      <Text className="text-lg">{content}</Text>
    </View>
  );
}
