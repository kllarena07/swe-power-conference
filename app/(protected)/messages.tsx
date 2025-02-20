import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import MessageCard from "@/components/MessageCard";
import { MaterialIcons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { useAuth } from "@/context/AuthContext";
import { sendPushNotification } from "@/utils/push-notif";
import { createMessage } from "@/utils/create-message";
import { supabase } from "@/utils/supabase";

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
          {profileData?.is_admin ? (
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
          ) : undefined}
          {messages.length > 0 ? (
            <ScrollView className="px-10">
              {messages.map(({ id, title, description, created_at }) => (
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
        </SafeAreaView>
      </View>
      <View
        className={`absolute bottom-0 left-0 bg-[hsla(278,41%,74%,1)] ${
          profileData?.is_admin ? "w-1/5" : "w-1/3"
        } h-[1.5px]`}
      />
    </GestureHandlerRootView>
  );
}
