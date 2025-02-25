import { Link, Stack } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <SafeAreaView className="flex-1 items-center justify-center p-5">
        <Text className="text-lg font-bold">This screen doesn't exist.</Text>

        <Link href="/" className="mt-3 py-3">
          <Text className="text-sm text-blue-600">Go to home screen!</Text>
        </Link>
      </SafeAreaView>
    </>
  );
}
