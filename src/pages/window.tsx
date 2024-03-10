import { useEffect, useState } from "react";
import Workspace, { Config } from "@/components/ui/Workspace";
import { Box, VStack } from "@chakra-ui/react";
import TopBar from "@/components/ui/TopBar";
import { v4 as uuidv4 } from "uuid";

const WindowedUi = () => {
  const [initialConfig, setInitialConfig] = useState<Config | undefined>();

  useEffect(() => {
    const storedConfig = window.localStorage.getItem("nuotillee-config");

    if (storedConfig) {
      setInitialConfig(JSON.parse(storedConfig) as Config);
    } else {
      setInitialConfig({
        id: uuidv4(),
        title: "Untitled",
        width: 8000,
        height: 6000,
        view: {
          scale: 1,
          position: {
            x: 0,
            y: 0,
          },
        },
        windows: [
          {
            id: uuidv4(),
            position: {
              x: 0,
              y: 0,
            },
            w: "8xl",
            type: "guitar",
            state: {},
          },
          {
            id: uuidv4(),
            position: {
              x: 0,
              y: 0,
            },
            type: "text",
            state: {
              content: "asd",
            },
          },
          {
            id: uuidv4(),
            position: {
              x: 0,
              y: 0,
            },
            type: "youtube",
            state: {
              url: "https://www.youtube.com/embed/zrZjVWbtUt4",
            },
          },
        ],
      });
    }
  }, []);

  return (
    <VStack h="100dvh" spacing={0}>
      {initialConfig && (
        <>
          <TopBar />
          <Box flex="1" backgroundColor="gray.100" w="100%" overflow="hidden">
            <Workspace initialConfig={initialConfig} />
          </Box>
        </>
      )}
    </VStack>
  );
};

export default WindowedUi;
