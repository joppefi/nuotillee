import React from "react";
import { Box, BoxProps, Flex } from "@chakra-ui/react";

import { formatPosition } from "./utils";
import { SettingsIcon, SmallCloseIcon } from "@chakra-ui/icons";

type WindowProps = {
  position: { x: number; y: number };
  w?: BoxProps["w"];
  children: React.ReactNode;
  onMoveStart: (evt: React.MouseEvent) => void;
  onMoveEnd: () => void;
  onDelete: () => void;
  onWidthChange: (w: BoxProps["w"]) => void;
};

const sizes = [
  "auto",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
];

const Window = ({
  position,
  children,
  w,
  onMoveStart,
  onMoveEnd,
  onDelete,
  onWidthChange,
}: WindowProps) => {
  const toggleSize = () => {
    const currentIndex = w ? sizes.indexOf(w) : 0;
    const nextIndex = (currentIndex + 1) % sizes.length;
    onWidthChange(sizes[nextIndex]);
  };

  return (
    <Box
      border="2px"
      borderColor="gray.500"
      borderRadius="10"
      w={w}
      position="absolute"
      transform={formatPosition(position)}
    >
      <Flex
        cursor="grab"
        onMouseDown={(evt) => onMoveStart(evt)}
        onMouseUp={onMoveEnd}
        w="full"
        p="2"
        justifyContent={"flex-end"}
      >
        <SettingsIcon cursor="pointer" onClick={toggleSize} />
        <SmallCloseIcon cursor="pointer" onClick={onDelete} />
      </Flex>
      {children}
    </Box>
  );
};

export default Window;
