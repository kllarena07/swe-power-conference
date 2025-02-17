import { supabase } from "@/utils/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  Alert,
  Button,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const isProcessing = useRef(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
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

  const handleCheckIn = async ({ id }: { id: string }) => {
    const alertBtnConfig = [
      {
        text: "Ok",
        onPress: () => {
          setScanned(false);
          isProcessing.current = false;
        },
      },
    ];

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("checked_in")
      .eq("user_id", id)
      .single();

    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("user_id", id)
      .single();

    if (userError) {
      Alert.alert(
        "Error",
        `Could not verify ${profile?.name}'s check-in status`,
        alertBtnConfig
      );
      return;
    }

    if (userData.checked_in) {
      Alert.alert(
        "Already Checked In",
        `${profile?.name} has already been checked in`,
        alertBtnConfig
      );
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ checked_in: true })
      .eq("user_id", id);

    if (error) {
      Alert.alert("Error checking-in user", `${error}`, alertBtnConfig);
      return;
    }

    Alert.alert("Success", `Checked in ${profile?.name || id}`, alertBtnConfig);
  };

  const handlePointAddition = ({
    points,
    id,
  }: {
    points: number;
    id: string;
  }) => {
    console.log(`Adding ${points} to ${id}`);
  };

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
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={({ data }) => {
              if (!scanned && !isProcessing.current && cameraMode) {
                isProcessing.current = true;
                setScanned(true);

                if (cameraMode === "check-in") {
                  handleCheckIn({ id: data });
                } else if (cameraMode === "points") {
                  handlePointAddition({ points: 0, id: data });
                }
              }
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
