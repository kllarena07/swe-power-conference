import { SafeAreaView, Text, ScrollView, View } from "react-native";
import AgendaItem, { AgendaItemType } from "@/components/AgendaItem";
import { supabase } from "@/utils/supabase";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const [agendaItems, setAgendaItems] = useState<AgendaItemType[]>([]);
  const { profileData } = useAuth();

  useEffect(() => {
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
          const fetchedMap = new Map(data.map((item) => [item.id, item]));

          const reconciledItems = prevItems.filter((item) =>
            fetchedMap.has(item.id)
          );

          data.forEach((item) => {
            const index = reconciledItems.findIndex(
              (existing) => existing.id === item.id
            );
            if (index === -1) {
              reconciledItems.push(item);
            } else {
              reconciledItems[index] = item;
            }
          });

          return reconciledItems;
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

            switch (payload.eventType) {
              case "INSERT":
                if (!prevItems.some((item) => item.id === payload.new.id)) {
                  updatedItems.push(payload.new as AgendaItemType);
                }
                break;
              case "UPDATE":
                updatedItems = prevItems.map((item) =>
                  item.id === payload.new.id
                    ? (payload.new as AgendaItemType)
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
