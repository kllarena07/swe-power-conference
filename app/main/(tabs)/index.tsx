// This is the agenda page

import { SafeAreaView, Text, View } from "react-native";

export default function Index() {
  return (
    <SafeAreaView className="relative h-full">
      <Text>This is the agenda page.</Text>
      <View className="absolute bottom-0 left-1/3 bg-[hsla(278,41%,74%,1)] w-1/3 h-[1.5px]" />
    </SafeAreaView>
  );
}
