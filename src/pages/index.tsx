import Guitar from "@/components/Guitar";
import Piano from "@/components/Piano";
import ScaleSelector from "@/components/ScaleSelector";
import SelectedNotes from "@/components/SelectedNotes";
import { HStack, VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <VStack mx="20" alignItems="flex-start">
      <Piano />
      <Guitar />
      <HStack>
        <SelectedNotes />
        <ScaleSelector />
      </HStack>
    </VStack>
  );
}
