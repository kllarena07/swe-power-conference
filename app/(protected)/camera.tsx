import { supabase } from "@/utils/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useReducer, useRef, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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

  // State for Android prompt
  const [isPointPromptVisible, setPointPromptVisible] = useState(false);
  const [pointInputValue, setPointInputValue] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // Optionally, auto-request permission if possible.
    if (permission && !permission.granted && permission.canAskAgain) {
      // Uncomment the next line to auto-trigger permission request:
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
        <View style={styles.centeredContainer}>
          <Text style={styles.infoText}>
            Camera permissions have been permanently denied. Please enable them
            in your device settings.
          </Text>
          <Button title="Open Settings" onPress={Linking.openSettings} />
        </View>
      );
    }
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.infoText}>
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

  // This function is only used on iOS.
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
    if (Platform.OS === "ios") {
      showPointPrompt(id);
    } else {
      // For Android, show custom prompt modal.
      setCurrentUserId(id);
      setPointPromptVisible(true);
    }
  };

  const SelectionScreen = () => (
    <View style={styles.selectionContainer}>
      <View style={styles.selectionInner}>
        <Text style={styles.selectionTitle}>Select a Camera Mode</Text>
        <TouchableOpacity
          style={styles.selectionButton}
          onPress={() => dispatch({ type: "OPEN_CAMERA", mode: "check-in" })}
        >
          <Text style={styles.selectionButtonText}>Check-In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.selectionButton}
          onPress={() => dispatch({ type: "OPEN_CAMERA", mode: "points" })}
        >
          <Text style={styles.selectionButtonText}>Point Addition</Text>
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
          <View style={styles.cameraHeader}>
            <Text style={styles.cameraHeaderText}>
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

      {/* Android Custom Prompt Modal */}
      {Platform.OS === "android" && isPointPromptVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isPointPromptVisible}
          onRequestClose={() => {
            setPointPromptVisible(false);
            resetScanningFlags();
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Enter the number of points to add
              </Text>
              <TextInput
                style={styles.modalInput}
                value={pointInputValue}
                onChangeText={setPointInputValue}
                keyboardType="numeric"
                placeholder="0"
              />
              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setPointPromptVisible(false);
                    setPointInputValue("");
                    resetScanningFlags();
                  }}
                />
                <Button
                  title="Submit"
                  onPress={() => {
                    const number = parseFloat(pointInputValue);
                    if (isNaN(number) || number < 0) {
                      Alert.alert(
                        "Invalid Input",
                        "Please enter a nonnegative number!"
                      );
                    } else if (currentUserId) {
                      addPoints(currentUserId, number);
                      setPointPromptVisible(false);
                      setPointInputValue("");
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

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

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  infoText: {
    textAlign: "center",
    paddingBottom: 10,
  },
  selectionContainer: {
    alignItems: "center",
    width: "100%",
  },
  selectionInner: {
    gap: 5,
    marginTop: 20,
  },
  selectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  selectionButton: {
    backgroundColor: "black",
    padding: 16,
    borderRadius: 6,
    marginBottom: 10,
    width: "80%",
  },
  selectionButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  cameraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
    marginTop: 10,
  },
  cameraHeaderText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
