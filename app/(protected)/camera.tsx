import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Button,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraMode, setCameraMode] = useState<
    "check-in" | "points" | undefined
  >(undefined);

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

  const SelectionScreen = () => {
    return (
      <View className="w-full items-center">
        <View className="gap-5">
          <Text className="text-3xl font-bold">Select a Camera Mode</Text>
          <TouchableOpacity
            className="bg-black p-5 rounded-md"
            onPress={() => setCameraMode("check-in")}
          >
            <Text className="text-white font-bold text-center">Check-In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-black p-5 rounded-md"
            onPress={() => setCameraMode("points")}
          >
            <Text className="text-white font-bold text-center">
              Point Addition
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const CameraScreen = () => {
    return (
      <View className="bg-black">
        <SafeAreaView className="w-full h-full px-5">
          <CameraView
            style={{
              flex: 1,
            }}
            facing="back"
            className="relative"
            onBarcodeScanned={(result) => {
              console.log(result.data);
            }}
          >
            <View className="flex flex-row justify-between items-center px-2">
              <Text className="font-bold text-lg text-white">
                Mode Selected: {cameraMode}
              </Text>
              <TouchableOpacity onPress={() => setCameraMode(undefined)}>
                <MaterialIcons name="close" size={32} color="white" />
              </TouchableOpacity>
            </View>
          </CameraView>
        </SafeAreaView>
      </View>
    );
  };

  return (
    <View className="relative flex-1 justify-center">
      {cameraMode ? <CameraScreen /> : <SelectionScreen />}
      <View className="absolute bottom-0 right-0 bg-[hsla(278,41%,74%,1)] w-1/4 h-[1.5px]" />
    </View>
  );
}
