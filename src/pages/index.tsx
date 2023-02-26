import Guitar from "@/components/Guitar";
import Piano from "@/components/Piano";
import { VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <VStack>
      <Piano />
      <Guitar />
    </VStack>
  );
}
