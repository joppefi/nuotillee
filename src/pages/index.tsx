import Guitar from "@/components/LegacyGuitar";
import Piano from "@/components/Piano";
import ScaleSelector from "@/components/ScaleSelector";
import SelectedNotes from "@/components/SelectedNotes";
import { Container, HStack, VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Container maxW="8xl">
      <VStack alignItems="flex-start">
        <Piano />
        <Guitar />
        <HStack alignItems="flex-start">
          <SelectedNotes />
          <ScaleSelector />
        </HStack>
      </VStack>
    </Container>
  );
}
