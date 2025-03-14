import { supabase } from "@/utils/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useReducer, useRef, useEffect } from "react";
import { Alert, Button, Platform, Text, View, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";

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

  useEffect(() => {
    // Optionally, auto-request permission if possible.
    if (permission && !permission.granted && permission.canAskAgain) {
      // Uncomment the following line if you want to auto-trigger permission request:
      // requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <SafeAreaView>
        <Text>
          Attempting to get the user's permission for camera access...
        </Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    if (!permission.canAskAgain) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ textAlign: "center", paddingBottom: 10 }}>
            Camera permissions have been permanently denied. Please enable them
            in your device settings.
          </Text>
          <Button title="Open Settings" onPress={Linking.openSettings} />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ textAlign: "center", paddingBottom: 10 }}>
          We need your permission to show the camera.
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
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
    if (Platform.OS === "ios") {
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
    } else {
      Alert.alert("Feature not available. Please use iOS");
    }
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
    <View style={{ alignItems: "center", width: "100%" }}>
      <View style={{ gap: 5 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          Select a Camera Mode
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            padding: 16,
            borderRadius: 6,
            marginBottom: 10,
          }}
          onPress={() => dispatch({ type: "OPEN_CAMERA", mode: "check-in" })}
        >
          <Text
            style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
          >
            Check-In
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            padding: 16,
            borderRadius: 6,
          }}
          onPress={() => dispatch({ type: "OPEN_CAMERA", mode: "points" })}
        >
          <Text
            style={{ color: "white", fontWeight: "bold", textAlign: "center" }}
          >
            Point Addition
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const CameraScreen = () => (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 5 }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 2,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "white" }}>
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
    <View style={{ flex: 1, position: "relative", justifyContent: "center" }}>
      {!state.cameraMode && <SelectionScreen />}
      {state.cameraMode && <CameraScreen />}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          right: "20%",
          backgroundColor: "hsla(278,41%,74%,1)",
          width: "20%",
          height: 1.5,
        }}
      />
    </View>
  );
}
