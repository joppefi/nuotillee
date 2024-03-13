import { useState } from "react";
import { Box, VStack } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";

import Workspace, { Config } from "@/components/ui/Workspace";
import WorkspaceSelector from "@/components/ui/WorkspaceSelector";

import { useWorkspaces } from "@/lib/swr";

const WindowedUi = () => {
  const [initialConfig, setInitialConfig] = useState<Config | undefined>();

  const { isLoading, data, mutate } = useWorkspaces();

  const newWorkspace = () => {
    setInitialConfig({
      id: uuidv4(),
      title: "Untitled",
      width: 8000,
      height: 6000,
      view: {
        scale: 1,
        position: {
          x: -2000,
          y: -800,
        },
      },
      windows: [
        {
          id: uuidv4(),
          position: {
            x: 2300,
            y: 800,
          },
          w: "8xl",
          type: "guitar",
          state: {},
        },
        {
          id: uuidv4(),
          position: {
            x: 2300,
            y: 800,
          },
          type: "youtube",
          state: {
            url: "https://www.youtube.com/embed/zrZjVWbtUt4",
          },
        },
      ],
    });
  };

  const handleExit = () => {
    mutate();
    setInitialConfig(undefined);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <VStack h="100dvh" spacing={0}>
        {initialConfig && (
          <Box
            key={initialConfig.id}
            flex="1"
            backgroundColor="gray.100"
            w="100%"
            overflow="hidden"
          >
            <Workspace initialConfig={initialConfig} onExit={handleExit} />
          </Box>
        )}
      </VStack>
      <WorkspaceSelector
        isOpen={!initialConfig}
        workspaces={data}
        onSelect={(config) => setInitialConfig(config)}
        onCreate={newWorkspace}
      />
    </>
  );
};

export default WindowedUi;
