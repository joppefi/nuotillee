import Guitar from "@/components/Guitar";
import Piano from "@/components/Piano";
import SelectedNotes from "@/components/SelectedNotes";
import { VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <VStack>
      <Piano />
      <Guitar />
      <SelectedNotes />
    </VStack>
  );
}
