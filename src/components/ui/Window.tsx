import React from "react";
import { Box } from "@chakra-ui/react";

import { formatPositionChildren } from "./utils";
import { DragHandleIcon } from "@chakra-ui/icons";

type WindowProps = {
  position: { x: number; y: number };
  children: React.ReactNode;
  index: number;
  onMoveStart: (evt: React.MouseEvent, index: number) => void;
  onMoveEnd: () => void;
};

const Window = ({
  position,
  children,
  index,
  onMoveStart,
  onMoveEnd,
}: WindowProps) => {
  return (
    <Box
      border="2px"
      borderColor="gray.500"
      borderRadius="10"
      w="8xl"
      position="absolute"
      transform={formatPositionChildren(position)}
    >
      <Box
        cursor="grab"
        onMouseDown={(evt) => onMoveStart(evt, index)}
        onMouseUp={onMoveEnd}
        id={`windowheader-${index}`}
        w="full"
        p="2"
      >
        <DragHandleIcon pointerEvents="none" />
      </Box>
      {children}
    </Box>
  );
};

export default Window;
