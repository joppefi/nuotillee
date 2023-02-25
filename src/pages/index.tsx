import Guitar from "@/components/Guitar";
import Piano from "@/components/Piano";
import { Box } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box>
      <Piano />
      <Guitar />
    </Box>
  );
}
