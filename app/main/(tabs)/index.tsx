// This is the agenda page
import { SafeAreaView, Text, View, ScrollView } from "react-native";
import AgendaItem from "@/components/AgendaItem";

interface AgendaItemProps {
  time: string,
  title: string,
  description: string

}

export default function Index() {
  const agendaItems = [ {
    time: "10:00-13:00",
    title: "Sponsor Fair",
    description: "Connect with sponsors"
  },
  {
    time: "14:00-15:00",
    title: "Technical Workshop",
    description: "Learn some fun stuff and blah"
  },
  {
    time: "19:00-20:00",
    title: "Closing Remarks",
    description: "Power day done"
  },
  {
    time: "19:00-20:00",
    title: "Closing Remarks",
    description: "Power day done"
  } ];

  return (
    <SafeAreaView className="relative h-full bg-white">
      <Text className="text-4xl mt-3.5 mb-10 font-bold text-center">
        Agenda
      </Text>
      
      <ScrollView className="px-6">
        {agendaItems.map((item, index) => (
          <AgendaItem
            key={index}
            time={item.time}
            title={item.title}
            description={item.description}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}