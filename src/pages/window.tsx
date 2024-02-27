import Guitar from "@/components/Guitar";
import PanHandler from "@/components/ui/PanHandler";
import Piano from "@/components/Piano";
import ScaleSelector from "@/components/ScaleSelector";
import { Box, VStack } from "@chakra-ui/react";
import TopBar from "@/components/ui/TopBar";

const WindowedUi = () => {
  return (
    <VStack h="100dvh" spacing={0}>
      <TopBar />
      <Box flex="1" backgroundColor="gray.100" w="100%" overflow="hidden">
        <PanHandler>
          <Box w="8xl">
            <Piano />
          </Box>

          <Box w="8xl">
            <Guitar />
          </Box>
          <ScaleSelector />
        </PanHandler>
      </Box>
    </VStack>
  );
};

export default WindowedUi;
