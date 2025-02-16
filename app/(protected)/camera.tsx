import { SafeAreaView, Text, View } from "react-native";

export default function Camera() {
  return (
    <SafeAreaView className="relative h-full">
      <Text>This is the camera scanning page.</Text>
      <View className="absolute bottom-0 right-0 bg-[hsla(278,41%,74%,1)] w-1/4 h-[1.5px]" />
    </SafeAreaView>
  );
}
