import React, { useState } from "react";

import { Box } from "@chakra-ui/react";
import { formatPosition } from "./utils";

import Window from "./Window";

type Position = {
  x: number;
  y: number;
};

type CursorPos = Position & {
  window?: number;
};

const WIDTH = 6000;
const HEIGHT = 3000;

const PanHandler = ({ children }: { children: React.ReactNode[] }) => {
  const initialPosition = { x: -1500, y: 0 };

  const [viewScale, setViewScale] = useState(1);
  const [viewPosition, setViewPosition] = useState(initialPosition);

  const [windowPositions, setWindowPositions] = useState<Position[]>(
    children.map(() => initialPosition)
  );

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
      setDragElementStartPos(viewPosition);
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
      const dx = (nativeEvent.clientX - dragCursorStartPos.x) / viewScale;
      const dy = (nativeEvent.clientY - dragCursorStartPos.y) / viewScale;

      if (dragCursorStartPos.window !== undefined) {
        setWindowPositions((prev) => {
          const newPositions = [...prev];
          newPositions[dragCursorStartPos.window as number] = {
            x: dragElementStartPos.x - dx,
            y: dragElementStartPos.y + dy,
          };
          return newPositions;
        });
      } else {
        setViewPosition({
          x: dragElementStartPos.x + dx,
          y: dragElementStartPos.y + dy,
        });
      }
    }
  };

  const handleScale = (evt: React.WheelEvent) => {
    const delta = evt.deltaY;
    const newScale = viewScale + delta / 1000;

    if (newScale > 0.1) {
      setViewScale(newScale);
    }
  };

  const handleWindowMove = (
    { nativeEvent }: React.MouseEvent,
    index: number
  ) => {
    setDragElementStartPos(windowPositions[index]);
    setDragCursorStartPos({
      x: nativeEvent.clientX,
      y: nativeEvent.clientY,
      window: index,
    });
  };

  return (
    <Box flex="1" w="full" h="full">
      <Box
        style={{ scale: `${viewScale}` }}
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
          transform={formatPosition(viewPosition)}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onWheel={handleScale}
          onMouseLeave={handleMouseUp}
        >
          {children?.map((child: React.ReactNode, index: number) => (
            <Window
              key={`window${index}`}
              index={index}
              position={windowPositions[index]}
              onMoveStart={handleWindowMove}
              onMoveEnd={handleMouseUp}
            >
              {child}
            </Window>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PanHandler;
