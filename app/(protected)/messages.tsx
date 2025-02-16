import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import MessageCard from "@/components/MessageCard";
import { MaterialIcons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";

type ProfileData = {
  id: number;
  created_at: string;
  name: string;
  email: string;
  points: number;
  checked_in: boolean;
  is_admin: boolean;
  expo_push_token: string;
  user_id: string;
};

export default function Messages() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const { user } = useAuth();

  const [profileData, setProfileData] = useState<ProfileData | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchProfileData = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      if (data) {
        setProfileData(data);
      }
    };
    fetchProfileData();

    const channel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setProfileData(payload.new as ProfileData);
          }
        }
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };
  }, [user?.id]);

  const tap = Gesture.Tap()
    .numberOfTaps(2)
    .runOnJS(true)
    .onEnd(() => {
      setIsModalVisible(false);
    });

  const handleSendMessage = () => {
    // send message logic here
  };

  return (
    <GestureHandlerRootView className="relative">
      {isModalVisible ? (
        <GestureDetector gesture={tap}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
            }}
            className="absolute bg-transparent justify-center items-center w-full h-full z-50"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              className="bg-white p-4 rounded-lg w-4/5 rounded-3xl"
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
                className="bg-white rounded-lg"
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color="hsla(0,0%,74%,1)"
                  onPress={() => setIsModalVisible(false)}
                  className="self-end"
                />
              </TouchableOpacity>
              <View className="gap-5">
                <Text className="text-3xl font-bold">Compose</Text>
                <TextInput
                  placeholder="Title"
                  onChangeText={(text) => setModalTitle(text)}
                  value={modalTitle}
                  className="border border-gray-200 bg-gray-100 rounded-lg py-4 px-3"
                />
                <TextInput
                  placeholder="Type your message here..."
                  multiline={true}
                  numberOfLines={10}
                  textAlignVertical="top"
                  onChangeText={(text) => setModalContent(text)}
                  value={modalContent}
                  className="border border-gray-200 bg-gray-100 rounded-lg py-4 px-3 h-48"
                />
                <TouchableOpacity
                  className="bg-[hsla(278,27%,48%,1)] rounded-lg"
                  onPress={handleSendMessage}
                >
                  <Text className="font-bold text-white p-5 text-center">
                    Send
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </GestureDetector>
      ) : undefined}

      <View className={`relative ${isModalVisible ? "opacity-50" : ""}`}>
        <SafeAreaView className="relative bg-white h-full">
          <Text className="text-4xl mt-3.5 mb-10 font-bold text-center">
            Messages
          </Text>
          <TouchableOpacity
            className="bg-[hsla(278,27%,48%,1)] absolute right-5 bottom-5 w-fit h-fit rounded-full z-50"
            onPress={() => setIsModalVisible(true)}
          >
            <MaterialIcons
              name="edit"
              size={32}
              color="white"
              className="self-center p-3"
            />
          </TouchableOpacity>
          <ScrollView className="px-10">
            {Array.from({ length: 10 }).map((_, index) => (
              <MessageCard
                key={index}
                title="Important"
                content="Lunch time has been slightly moved to 2pm"
                time={new Date(new Date().setHours(22, 37, 0))}
              />
            ))}
          </ScrollView>
        </SafeAreaView>
      </View>
      <View className="absolute bottom-0 left-0 bg-[hsla(278,41%,74%,1)] w-1/3 h-[1.5px]" />
    </GestureHandlerRootView>
  );
}
