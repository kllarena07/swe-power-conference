import { SafeAreaView, Text, ScrollView, View } from "react-native";
import AgendaItem from "@/components/AgendaItem";
import { supabase } from "@/utils/supabase";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

type AgendaItem = {
  id: number;
  created_at: string;
  start_time: string;
  end_time: string;
  point_value: number;
  title: string;
  description: string;
};

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

export default function Index() {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
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

    const fetchAgenda = async () => {
      const { data, error } = await supabase
        .from("agenda")
        .select("*")
        .order("start_time");

      if (error) {
        console.error("Error fetching agenda:", error);
        return;
      }

      if (data) {
        setAgendaItems((prevItems) => {
          // Merge existing items with new data, filtering duplicates
          const newItems = data.filter(
            (newItem) => !prevItems.some((oldItem) => oldItem.id === newItem.id)
          );
          return [...prevItems, ...newItems];
        });
      }
    };

    fetchAgenda();

    const channel = supabase
      .channel("agenda-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agenda" },
        (payload) => {
          setAgendaItems((prevItems) => {
            let updatedItems = [...prevItems];

            // Existing real-time update logic remains unchanged
            switch (payload.eventType) {
              case "INSERT":
                if (!prevItems.some((item) => item.id === payload.new.id)) {
                  updatedItems.push(payload.new as AgendaItem);
                }
                break;
              case "UPDATE":
                updatedItems = prevItems.map((item) =>
                  item.id === payload.new.id
                    ? (payload.new as AgendaItem)
                    : item
                );
                break;
              case "DELETE":
                updatedItems = prevItems.filter(
                  (item) => item.id !== payload.old.id
                );
                break;
              default:
                return prevItems;
            }
            return updatedItems;
          });
        }
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };
  }, []);

  // Sorting logic remains unchanged
  const sortedAgendaItems = useMemo(() => {
    return [...agendaItems].sort((a, b) =>
      a.start_time.localeCompare(b.start_time)
    );
  }, [agendaItems]);

  return (
    <SafeAreaView className="relative h-full bg-white">
      <Text className="text-4xl mt-3.5 mb-10 font-bold text-center">
        Agenda
      </Text>

      <ScrollView className="px-6">
        {sortedAgendaItems.length === 0 ? (
          <Text className="text-center text-gray-500">
            No agenda items available
          </Text>
        ) : (
          sortedAgendaItems.map(
            ({ id, start_time, end_time, title, description }, index) => (
              <AgendaItem
                key={id}
                index={index}
                start_time={start_time}
                end_time={end_time}
                title={title}
                description={description}
              />
            )
          )
        )}
      </ScrollView>
      <View
        className={`absolute bottom-0 ${
          profileData?.is_admin ? "left-1/4" : "left-1/3"
        } bg-[hsla(278,41%,74%,1)] ${
          profileData?.is_admin ? "w-1/4" : "w-1/3"
        } h-[1.5px]`}
      />
    </SafeAreaView>
  );
}
