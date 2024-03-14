import React from "react";
import { Box, HStack, Tag } from "@chakra-ui/react";
import { getNoteColor, NoteName } from "@/utils/notes";

type NoteBadgeProps = {
  notes: NoteName[];
};

const NoteBadgeStack = ({ notes }: NoteBadgeProps) => {
  return (
    <HStack p="2">
      {notes?.map((note) => (
        <Tag
          size="lg"
          key={note}
          borderRadius="full"
          bgColor={getNoteColor(note)}
          color="black"
        >
          {note}
        </Tag>
      ))}
    </HStack>
  );
};

export default NoteBadgeStack;
