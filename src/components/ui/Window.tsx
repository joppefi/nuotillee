import React from "react";
import { Box, BoxProps, Flex } from "@chakra-ui/react";

import { formatPosition } from "./utils";
import {
  CloseIcon,
  DeleteIcon,
  DragHandleIcon,
  SettingsIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";

type WindowProps = {
  position: { x: number; y: number };
  w?: BoxProps["w"];
  children: React.ReactNode;
  onMoveStart: (evt: React.MouseEvent) => void;
  onMoveEnd: () => void;
  onDelete: () => void;
};

const Window = ({
  position,
  children,
  w,
  onMoveStart,
  onMoveEnd,
  onDelete,
}: WindowProps) => {
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
        <SmallCloseIcon cursor="pointer" onClick={onDelete} />
      </Flex>
      {children}
    </Box>
  );
};

export default Window;
