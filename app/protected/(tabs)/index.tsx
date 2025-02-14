import { SafeAreaView, Text, ScrollView } from "react-native";
import AgendaItem from "@/components/AgendaItem";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";

type AgendaItem = {
  id: number;
  created_at: string;
  start_time: string;
  end_time: string;
  point_value: number;
  title: string;
  description: string;
};

export default function Index() {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel("agenda-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agenda" },
        () => {
          // Fetch all agenda items after any change
          const fetchAgenda = async () => {
            const { data, error } = await supabase
              .from("agenda")
              .select("*")
              .order("start_time");
            if (error) {
              console.error("Error fetching agenda:", error);
              return;
            }
            if (data) setAgendaItems(data);
          };
          fetchAgenda();
        }
      )
      .subscribe();

    // Initial fetch
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
        console.log("Fetched agenda items:", data.length);
        setAgendaItems(data);
      }
    };
    fetchAgenda();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView className="relative h-full bg-white">
      <Text className="text-4xl mt-3.5 mb-10 font-bold text-center">
        Agenda
      </Text>

      <ScrollView className="px-6">
        {agendaItems.length === 0 ? (
          <Text className="text-center text-gray-500">
            No agenda items available
          </Text>
        ) : (
          agendaItems.map(
            ({ start_time, end_time, title, description }, index) => (
              <AgendaItem
                key={index}
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
    </SafeAreaView>
  );
}
