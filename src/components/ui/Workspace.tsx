import React, { useEffect, useState } from "react";

import {
  Box,
  BoxProps,
  Button,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  VStack,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  FormControl,
  Editable,
  EditableInput,
  EditablePreview,
  FormLabel,
  HStack,
  DrawerFooter,
} from "@chakra-ui/react";

import { v4 as uuidv4 } from "uuid";

import { formatPosition } from "./utils";

import Window from "./Window";
import Guitar from "../LegacyGuitar";
import TextBox from "../TextBox";
import YoutubeEmbed from "../YoutubeEmbed";
import { WindowComponentProps } from "../types";
import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import ChordStack, { ChordState } from "../ChordStack";
import { useWorkspaceMutation } from "@/lib/swr";

type Position = {
  x: number;
  y: number;
};

type CursorPos = Position & {
  window?: string;
};

const windowTypes = [
  "guitar",
  "debug",
  "piano",
  "text",
  "youtube",
  "chords",
] as const;
type WindowType = (typeof windowTypes)[number];

type Window<Type extends WindowType, State> = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  w?: BoxProps["w"];
  type: Type;
  state?: State;
};

export type Config = {
  id: string;
  title: string;
  width: number;
  height: number;
  view: {
    scale: number;
    position: {
      x: number;
      y: number;
    };
  };
  windows: Array<
    | Window<"guitar", {}>
    | Window<"debug", {}>
    | Window<"piano", {}>
    | Window<"text", { content: string }>
    | Window<"youtube", { url: string }>
    | Window<"chords", ChordState>
  >;
};

const WIDTH = 6000;
const HEIGHT = 3000;

type PanHandlerProps = {
  initialConfig: Config;
  onExit: () => void;
};

const Workspace = ({ initialConfig, onExit }: PanHandlerProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initialPosition = { x: -1500, y: 0 };

  const [config, setConfig] = useState<Config>(initialConfig);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const { trigger, isMutating } = useWorkspaceMutation();

  /**
   * States for handling drag
   */
  const [dragElementStartPos, setDragElementStartPos] = useState<
    Position | undefined
  >(initialPosition);
  const [dragCursorStartPos, setDragCursorStartPos] = useState<
    CursorPos | undefined
  >(undefined);

  /**
   * Mouse event listeners
   */

  const handleMouseDown = ({ nativeEvent }: React.MouseEvent) => {
    const { id } = nativeEvent.target as HTMLElement;

    if (id === "panhandler") {
      setDragElementStartPos(config.view.position);
      setDragCursorStartPos({
        x: nativeEvent.clientX,
        y: nativeEvent.clientY,
      });
    }
  };

  const handleMouseUp = () => {
    setDragCursorStartPos(undefined);
    setDragElementStartPos(undefined);
  };

  const handleCreate = (type: WindowType) => {
    const position = config.windows.at(-1)
      ? config.windows.at(-1)?.position
      : { x: 0, y: 0 };

    if (position) {
      const newConfig: Config = {
        ...config,
        windows: [
          ...config.windows,
          {
            id: uuidv4(),
            position,
            type,
          },
        ],
      };

      setConfig(newConfig);
      saveConfig(newConfig);
    }
  };

  const handleMouseMove = ({ nativeEvent }: React.MouseEvent) => {
    if (dragCursorStartPos && dragElementStartPos) {
      const { scale } = config.view;
      const dx = (nativeEvent.clientX - dragCursorStartPos.x) / scale;
      const dy = (nativeEvent.clientY - dragCursorStartPos.y) / scale;

      const position = {
        x: dragElementStartPos.x + dx,
        y: dragElementStartPos.y + dy,
      };

      if (dragCursorStartPos.window !== undefined) {
        moveWindow(dragCursorStartPos.window, position);
      } else {
        setConfig((prev) => ({
          ...prev,
          view: {
            ...prev.view,
            position,
          },
        }));
      }
    }
  };

  const handleScale = (evt: React.WheelEvent) => {
    const delta = evt.deltaY;
    const newScale = config.view.scale + delta / 1000;

    if (newScale > 0.1) {
      setConfig((prev) => ({
        ...prev,
        view: {
          ...prev.view,
          scale: newScale,
        },
      }));
    }
  };

  const handleWindowMoveStart = (
    { nativeEvent }: React.MouseEvent,
    id: string
  ) => {
    const window = config.windows.find((window) => window.id === id);
    if (window) {
      setDragElementStartPos(window.position);
      setDragCursorStartPos({
        x: nativeEvent.clientX,
        y: nativeEvent.clientY,
        window: id,
      });
    }
  };

  const moveWindow = (id: string, position: Position) => {
    const newConfig = {
      ...config,
      windows: config.windows.map((window, index) => {
        if (window.id === id) {
          return {
            ...window,
            position,
          };
        }
        return window;
      }),
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleComponentStateChange = ({
    id,
    state,
  }: {
    id: string;
    state: any;
  }) => {
    const newConfig = {
      ...config,
      windows: config.windows.map((window, index) => {
        if (window.id === id) {
          return {
            ...window,
            state,
          };
        }
        return window;
      }),
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleDeleteComponent = (id: string) => {
    const newConfig = {
      ...config,
      windows: config.windows.filter((window) => window.id !== id),
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleWidthChange = (w: BoxProps["w"], id: string) => {
    const newConfig = {
      ...config,
      windows: config.windows.map((window) => {
        if (window.id === id) {
          return {
            ...window,
            w,
          };
        }
        return window;
      }),
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const handleTitle = (title: string) => {
    console.log(title);
    const newConfig = {
      ...config,
      title,
    };
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  const saveConfig = (config: Config) => {
    window.localStorage.setItem("nuotillee-config", JSON.stringify(config));
  };

  const handleApiSave = async () => {
    const data = trigger(config);

    console.log(data);
  };

  if (!isClient) {
    return null;
  }

  return (
    <Box flex="1" w="full" h="full">
      <Box
        style={{ scale: `${config.view.scale}` }}
        transformOrigin="50% 50%"
        w="full"
        h="full"
        userSelect={dragCursorStartPos ? "none" : "auto"}
      >
        <Box
          backgroundColor="whiteAlpha.800"
          w={`${WIDTH}px`}
          h={`${HEIGHT}px`}
          p="2"
          id="panhandler"
          transform={formatPosition(config.view.position)}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onWheel={handleScale}
          onMouseLeave={handleMouseUp}
        >
          {config.windows.map(({ id, type, state, w }, index) => {
            let Component = (props: WindowComponentProps<any>) => <></>;
            switch (type) {
              case "guitar":
                Component = Guitar;
                break;
              case "debug":
                // eslint-disable-next-line react/display-name
                Component = () => <pre>{JSON.stringify(config, null, 2)}</pre>;
                break;
              case "text":
                Component = TextBox;
                break;
              case "youtube":
                Component = YoutubeEmbed;
                break;
              case "chords":
                Component = ChordStack;
                break;
            }
            return (
              <Window
                key={id}
                w={w}
                position={config.windows[index].position}
                onMoveStart={(evt) => handleWindowMoveStart(evt, id)}
                onMoveEnd={handleMouseUp}
                onDelete={() => handleDeleteComponent(id)}
                onWidthChange={(w) => handleWidthChange(w, id)}
              >
                <Component
                  state={state}
                  onStateChange={(nextState) => {
                    handleComponentStateChange({ id, state: nextState });
                  }}
                />
              </Window>
            );
          })}
        </Box>
      </Box>
      <Box id="overlay" position="fixed" bottom={0} right={0} p="2">
        <HStack>
          <Popover>
            <PopoverTrigger>
              <IconButton
                //onClick={handleCreate}
                aria-label="Add"
                icon={<AddIcon />}
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <VStack>
                  {windowTypes.map((type) => (
                    <Button
                      key={type}
                      w="full"
                      variant="ghost"
                      onClick={() => handleCreate(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Button isLoading={isMutating} onClick={handleApiSave}>
            Save
          </Button>
          <IconButton
            onClick={onOpen}
            aria-label="Settings"
            icon={<SettingsIcon />}
          />
        </HStack>
        <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerBody>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Editable value={config.title} onChange={handleTitle}>
                  <EditablePreview />
                  <EditableInput />
                </Editable>
              </FormControl>
            </DrawerBody>
            <DrawerFooter>
              <Button variant="ghost" onClick={onExit}>
                Exit workspace
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Box>
    </Box>
  );
};

export default Workspace;
