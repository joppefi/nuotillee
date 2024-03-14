import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerFooter,
  Button,
  VStack,
} from "@chakra-ui/react";
import { Config } from "./Workspace";

type WorkspaceSelectorProps = {
  workspaces: Config[];
  isOpen: boolean;
  onSelect: (workspace: Config) => void;
  onCreate: () => void;
};

const WorkspaceSelector = ({
  workspaces,
  isOpen,
  onSelect,
  onCreate,
}: WorkspaceSelectorProps) => {
  return (
    <Drawer placement="left" size="full" isOpen={isOpen} onClose={() => {}}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Select workspace</DrawerHeader>
        <DrawerBody>
          <VStack>
            {workspaces.map((workspace) => (
              <Button
                variant="ghost"
                key={workspace.id}
                onClick={() => onSelect(workspace)}
              >
                {workspace.title}
              </Button>
            ))}
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" onClick={onCreate}>
            Create workspace
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default WorkspaceSelector;
