import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

import { v4 as uuidv4 } from "uuid";

import { formatPosition } from "./utils";

import Window from "./Window";
import Guitar from "../Guitar";

type Position = {
  x: number;
  y: number;
};

type CursorPos = Position & {
  window?: number;
};

type Window<WindowType, WindowProps> = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  type: WindowType;
  props: WindowProps;
};

type Config = {
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
    Window<"guitar", {}> | Window<"debug", {}> | Window<"piano", {}>
  >;
};

const WIDTH = 6000;
const HEIGHT = 3000;

const PanHandler = ({ children }: { children: React.ReactNode[] }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initialPosition = { x: -1500, y: 0 };

  const [config, setConfig] = useState<Config>({
    width: 6000,
    height: 3000,
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
        type: "guitar",
        props: {
          note: "E4",
        },
      },
      {
        id: uuidv4(),
        position: {
          x: 0,
          y: 0,
        },
        type: "debug",
        props: {
          text: "asd",
        },
      },
    ],
  });

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

  const handleMouseMove = ({ nativeEvent }: React.MouseEvent) => {
    if (dragCursorStartPos && dragElementStartPos) {
      const { scale } = config.view;
      const dx = (nativeEvent.clientX - dragCursorStartPos.x) / scale;
      const dy = (nativeEvent.clientY - dragCursorStartPos.y) / scale;

      if (dragCursorStartPos.window !== undefined) {
        setConfig((prev) => ({
          ...prev,
          windows: prev.windows.map((window, index) => {
            if (index === dragCursorStartPos.window) {
              return {
                ...window,
                position: {
                  x: dragElementStartPos.x + dx,
                  y: dragElementStartPos.y + dy,
                },
              };
            }
            return window;
          }),
        }));
      } else {
        setConfig((prev) => ({
          ...prev,
          view: {
            ...prev.view,
            position: {
              x: dragElementStartPos.x + dx,
              y: dragElementStartPos.y + dy,
            },
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

  const handleWindowMove = (
    { nativeEvent }: React.MouseEvent,
    index: number
  ) => {
    setDragElementStartPos(config.windows[index].position);
    setDragCursorStartPos({
      x: nativeEvent.clientX,
      y: nativeEvent.clientY,
      window: index,
    });
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
          {config.windows.map(({ id, type }, index) => {
            switch (type) {
              case "guitar":
                return (
                  <Window
                    key={id}
                    index={index}
                    position={config.windows[index].position}
                    onMoveStart={handleWindowMove}
                    onMoveEnd={handleMouseUp}
                  >
                    <Guitar />
                  </Window>
                );
              case "debug":
                return (
                  <Window
                    key={id}
                    index={index}
                    position={config.windows[index].position}
                    onMoveStart={handleWindowMove}
                    onMoveEnd={handleMouseUp}
                  >
                    <pre>{JSON.stringify(config, null, 2)}</pre>
                  </Window>
                );
            }
            return null;
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default PanHandler;
