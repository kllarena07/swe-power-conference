import {
  Text,
  View,
  ScrollView,
  TextInput,
  Keyboard,
  Alert,
  GestureResponderEvent,
} from "react-native";
import React, { useState, useEffect } from "react";
import MessageCard from "@/components/MessageCard";
import { MaterialIcons } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useAuth } from "@/context/AuthContext";
import { sendPushNotification } from "@/utils/push-notif";
import { createMessage } from "@/utils/create-message";
import { supabase } from "@/utils/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";

type MessageItem = {
  created_at: string;
  title: string;
  description: string;
  id: number;
};

export default function Messages() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const { profileData, accessToken } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase.from("messages").select("*");

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      if (data) {
        setMessages(data);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prevMessages) => {
            let updatedMessages = [...prevMessages];

            switch (payload.eventType) {
              case "INSERT":
                if (!prevMessages.some((msg) => msg.id === payload.new.id)) {
                  updatedMessages.push(payload.new as MessageItem);
                }
                break;
              case "UPDATE":
                updatedMessages = prevMessages.map((msg) =>
                  msg.id === payload.new.id ? (payload.new as MessageItem) : msg
                );
                break;
              case "DELETE":
                updatedMessages = prevMessages.filter(
                  (msg) => msg.id !== payload.old.id
                );
                break;
              default:
                return prevMessages;
            }
            return updatedMessages;
          });
        }
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };
  }, []);

  const tap = Gesture.Tap()
    .numberOfTaps(2)
    .runOnJS(true)
    .onEnd(() => {
      setIsModalVisible(false);
    });

  const handleSendMessage = async () => {
    try {
      if (!modalTitle.trim() || !modalContent.trim()) {
        Alert.alert("Title and content cannot be empty");
        return;
      }

      console.log("Send attempt at:", new Date().toISOString());

      await createMessage({
        title: modalTitle,
        description: modalContent,
      });

      const response = await sendPushNotification({
        subject: modalTitle,
        message: modalContent,
        accessToken: accessToken,
      });

      if (!response.ok) {
        Alert.alert("Failed to send message", response.statusText);
      }

      setModalTitle("");
      setModalContent("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Send error:", error);
    }
  };

  return (
    <>
      {isModalVisible ? (
        <GestureDetector gesture={tap}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
            }}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              paddingHorizontal: 20,
              justifyContent: "center",
            }}
          >
            <View className="bg-white p-5 rounded-2xl">
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e?: GestureResponderEvent) => e?.stopPropagation()}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setIsModalVisible(false)}
                  style={{
                    alignSelf: "flex-end",
                  }}
                >
                  <MaterialIcons
                    name="close"
                    size={24}
                    color="hsla(0,0%,74%,1)"
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
                    onPress={handleSendMessage}
                    style={{
                      backgroundColor: "#82599a",
                    }}
                  >
                    <Text className="font-bold text-white p-5 text-center">
                      Send
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </GestureDetector>
      ) : undefined}

      <View
        className={`${
          isModalVisible ? "absolute w-full h-full z-[-1]" : "relative"
        }`}
      >
        <SafeAreaView
          className={`relative bg-white h-full ${
            isModalVisible ? "opacity-50" : ""
          }`}
        >
          <Text className="text-4xl mt-3.5 mb-10 font-bold text-center">
            Messages
          </Text>
          {messages.length > 0 ? (
            <ScrollView className="px-10">
              {messages
                .slice()
                .reverse()
                .map(({ id, title, description, created_at }) => (
                  <MessageCard
                    key={id}
                    title={title}
                    content={description}
                    time={new Date(created_at)}
                  />
                ))}
            </ScrollView>
          ) : (
            <Text className="text-center">
              There are no messages available.
            </Text>
          )}

          {profileData?.is_admin ? (
            <View className="w-full flex">
              <TouchableOpacity
                style={{
                  alignSelf: "flex-end",
                  backgroundColor: "#82599a",
                  borderRadius: 100,
                  marginRight: 20,
                }}
                onPress={() => setIsModalVisible(true)}
              >
                <MaterialIcons
                  name="edit"
                  size={32}
                  color="white"
                  className="self-center p-3"
                />
              </TouchableOpacity>
            </View>
          ) : undefined}
        </SafeAreaView>
      </View>
      <View
        className={`absolute bottom-0 left-0 bg-pastel-purple ${
          profileData?.is_admin ? "w-1/5" : "w-1/3"
        } h-[1.5px]`}
      />
    </>
  );
}
