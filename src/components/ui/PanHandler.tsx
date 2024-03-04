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

  const [scale, setScale] = useState(1);
  const [childrenPositions, setChildrenPositions] = useState<Position[]>(
    children.map(() => initialPosition)
  );

  const [renderPosition, setRenderPosition] = useState(initialPosition);

  const [dragElementStartPos, setDragElementStartPos] = useState<
    Position | undefined
  >(initialPosition);
  const [dragCursorStartPos, setDragCursorStartPos] = useState<
    CursorPos | undefined
  >(undefined);

  const handleMouseDown = ({ nativeEvent }: React.MouseEvent) => {
    const { id } = nativeEvent.target as HTMLElement;

    if (id === "panhandler") {
      setDragElementStartPos(renderPosition);
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
      const dx = (nativeEvent.clientX - dragCursorStartPos.x) / scale;
      const dy = (nativeEvent.clientY - dragCursorStartPos.y) / scale;

      if (dragCursorStartPos.window !== undefined) {
        setChildrenPositions((prev) => {
          const newPositions = [...prev];
          newPositions[dragCursorStartPos.window as number] = {
            x: dragElementStartPos.x - dx,
            y: dragElementStartPos.y + dy,
          };
          return newPositions;
        });
      } else {
        setRenderPosition({
          x: dragElementStartPos.x + dx,
          y: dragElementStartPos.y + dy,
        });
      }
    }
  };

  const handleScale = (evt: React.WheelEvent) => {
    const delta = evt.deltaY;
    const newScale = scale + delta / 1000;

    if (newScale > 0.1) {
      setScale(newScale);
    }
  };

  const handleWindowMove = (
    { nativeEvent }: React.MouseEvent,
    index: number
  ) => {
    setDragElementStartPos(childrenPositions[index]);
    setDragCursorStartPos({
      x: nativeEvent.clientX,
      y: nativeEvent.clientY,
      window: index,
    });
  };

  return (
    <Box flex="1" w="full" h="full">
      <Box
        style={{ scale: `${scale}` }}
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
          transform={formatPosition(renderPosition)}
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
              position={childrenPositions[index]}
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
