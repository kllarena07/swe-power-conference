import { SafeAreaView, View, Text } from "react-native";

export default function Raffle() {
  return (
    <SafeAreaView className="h-full">
      <Text>This is the raffle page</Text>
      <View className="absolute bottom-0 right-0 bg-[hsla(278,41%,74%,1)] w-1/5 h-[1.5px]" />
    </SafeAreaView>
  );
}
