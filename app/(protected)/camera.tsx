import { supabase } from "@/utils/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useReducer, useRef } from "react";
import {
  Alert,
  Button,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CameraMode = "check-in" | "points" | null;

interface State {
  cameraMode: CameraMode;
}

type Action =
  | { type: "OPEN_CAMERA"; mode: "check-in" | "points" }
  | { type: "CLOSE_CAMERA" };

const initialState: State = {
  cameraMode: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN_CAMERA":
      return { ...state, cameraMode: action.mode };
    case "CLOSE_CAMERA":
      return { cameraMode: null };
    default:
      return state;
  }
}

export default function CameraScanner() {
  const isProcessing = useRef(false);
  const scannedRef = useRef(false);

  const [permission, requestPermission] = useCameraPermissions();
  const [state, dispatch] = useReducer(reducer, initialState);

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

  const resetScanningFlags = () => {
    scannedRef.current = false;
    isProcessing.current = false;
  };

  const handleCheckIn = async ({ id }: { id: string }) => {
    const alertBtnConfig = [
      {
        text: "Ok",
        onPress: resetScanningFlags,
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

  const showPointPrompt = (id: string) => {
    Alert.prompt(
      "Enter the number of points to add",
      "Please enter a nonnegative number:",
      (text) => {
        const number = parseFloat(text);
        if (isNaN(number) || number < 0) {
          Alert.alert("Invalid Input", "Please enter a nonnegative number!", [
            { text: "Try Again", onPress: () => showPointPrompt(id) },
          ]);
        } else {
          addPoints(id, number);
        }
      },
      "plain-text"
    );
  };

  const addPoints = async (id: string, pointVal: number) => {
    const alertBtnConfig = [
      {
        text: "Ok",
        onPress: resetScanningFlags,
      },
    ];

    const { data: profile } = await supabase
      .from("profiles")
      .select("points, name")
      .eq("user_id", id)
      .single();

    if (!profile) {
      Alert.alert("Error", "Could not find user profile", alertBtnConfig);
      return;
    }

    const newPoints = (profile.points || 0) + pointVal;

    const { error } = await supabase
      .from("profiles")
      .update({ points: newPoints })
      .eq("user_id", id);

    if (error) {
      Alert.alert("Error adding points", error.message, alertBtnConfig);
      return;
    }

    Alert.alert(
      "Success",
      `Added ${pointVal} points to ${profile.name}. New total: ${newPoints}`,
      alertBtnConfig
    );
  };

  const handlePointAddition = async ({ id }: { id: string }) => {
    showPointPrompt(id);
  };

  const SelectionScreen = () => (
    <View
      className="w-full items-center"
      style={{
        display: state.cameraMode ? "none" : "flex",
      }}
    >
      <View className="gap-5">
        <Text className="text-3xl font-bold">Select a Camera Mode</Text>
        <TouchableOpacity
          className="bg-black p-5 rounded-md"
          onPress={() => dispatch({ type: "OPEN_CAMERA", mode: "check-in" })}
        >
          <Text className="text-white font-bold text-center">Check-In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-black p-5 rounded-md"
          onPress={() => dispatch({ type: "OPEN_CAMERA", mode: "points" })}
        >
          <Text className="text-white font-bold text-center">
            Point Addition
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CameraScreen = () => (
    <View
      style={{ display: state.cameraMode ? "flex" : "none" }}
      className="bg-black items-center justify-center"
    >
      <SafeAreaView className="w-full h-full px-5">
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          className="relative"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={({ data }) => {
            if (
              !scannedRef.current &&
              !isProcessing.current &&
              state.cameraMode
            ) {
              isProcessing.current = true;
              scannedRef.current = true;
              if (state.cameraMode === "check-in") {
                handleCheckIn({ id: data });
              } else if (state.cameraMode === "points") {
                handlePointAddition({ id: data });
              }
            }
          }}
        >
          <View className="flex flex-row justify-between items-center px-2">
            <Text className="font-bold text-lg text-white">
              Mode Selected: {state.cameraMode}
            </Text>
            <TouchableOpacity
              onPress={() => dispatch({ type: "CLOSE_CAMERA" })}
            >
              <MaterialIcons name="close" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </SafeAreaView>
    </View>
  );

  return (
    <View className="relative flex-1 justify-center">
      <SelectionScreen />
      <CameraScreen />
      <View className="absolute bottom-0 right-0 bg-[hsla(278,41%,74%,1)] w-1/4 h-[1.5px]" />
    </View>
  );
}
