import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { formatPosition } from "./utils";
import Window from "./Window";

type Position = {
  x: number;
  y: number;
};

type CursorPos = Position & {
  window?: number;
};

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
    if (scale > 0) {
      setScale((prev) => prev - delta / 1000);
    }
  };

  const handleWindowMove = (
    { nativeEvent }: React.MouseEvent,
    index: number
  ) => {
    console.log(
      "window start",
      nativeEvent.clientX,
      nativeEvent.clientY,
      index
    );

    setDragElementStartPos(childrenPositions[index]);
    setDragCursorStartPos({
      x: nativeEvent.clientX,
      y: nativeEvent.clientY,
      window: index,
    });
  };

  return (
    <Box
      backgroundColor="whiteAlpha.800"
      w="full"
      h="full"
      p="2"
      id="panhandler"
      style={{ scale: `${scale}` }}
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
  );
};

export default PanHandler;
