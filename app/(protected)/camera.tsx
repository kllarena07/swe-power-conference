import { CameraView, useCameraPermissions } from "expo-camera";
import { Button, SafeAreaView, Text, View } from "react-native";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <SafeAreaView>
        <Text>Attempting to get the user's permission for camera access.</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center pb-2.5">
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View className="relative flex-1 justify-center">
      <CameraView
        style={{
          flex: 1,
        }}
        facing="back"
      />
      <View className="absolute bottom-0 right-0 bg-[hsla(278,41%,74%,1)] w-1/4 h-[1.5px]" />
    </View>
  );
}
