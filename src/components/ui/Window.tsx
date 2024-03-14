import React from "react";
import { Box, BoxProps, Flex, Tooltip } from "@chakra-ui/react";

import { formatPosition } from "./utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LockIcon,
  SmallCloseIcon,
  UnlockIcon,
} from "@chakra-ui/icons";

type WindowProps = {
  locked?: boolean;
  position: { x: number; y: number };
  w?: BoxProps["w"];
  children: React.ReactNode;
  onMoveStart: (evt: React.MouseEvent) => void;
  onMoveEnd: () => void;
  onDelete: () => void;
  onWidthChange: (w: BoxProps["w"]) => void;
  onLocked: () => void;
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
  locked,
  position,
  children,
  w,
  onMoveStart,
  onMoveEnd,
  onDelete,
  onWidthChange,
  onLocked,
}: WindowProps) => {
  const handleWidthChange = (addValue: number) => {
    const currentIndex = w ? sizes.indexOf(w as string) : 0;
    const nextIndex = (currentIndex + addValue) % sizes.length;
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
        justifyContent={"space-between"}
      >
        <Box>
          <Tooltip label={w as string}>
            <ChevronLeftIcon
              cursor="pointer"
              onClick={() => handleWidthChange(-1)}
            />
          </Tooltip>
          <ChevronRightIcon
            cursor="pointer"
            onClick={() => handleWidthChange(1)}
          />
          {locked ? (
            <LockIcon onClick={onLocked} cursor="pointer" />
          ) : (
            <UnlockIcon onClick={onLocked} cursor="pointer" />
          )}
        </Box>
        <SmallCloseIcon cursor="pointer" onClick={onDelete} />
      </Flex>
      <Box pointerEvents={locked ? "none" : undefined}>{children}</Box>
    </Box>
  );
};

export default Window;
