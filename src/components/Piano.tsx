import { generateNotesBetween } from "@/utils/notes";
import { Flex } from "@chakra-ui/react";
import React from "react";
import { useSelections } from "./SelectedContext";

const Piano = () => {
  const notes = generateNotesBetween("A0", "C8");
  const { selectedNote, setSelectedNote } = useSelections();
  return (
    <Flex>
      {notes.map((note) => (
        <Flex
          border="1px"
          w="25px"
          h={note.sharp ? "75px" : "100px"}
          justifyContent="center"
          alignItems="flex-end"
          backgroundColor={
            note.formatted === selectedNote?.formatted
              ? "green"
              : note.sharp
              ? "black"
              : note.color
          }
          color={note.sharp ? "white" : "black"}
          position={note.sharp ? "relative" : undefined}
          marginLeft={note.sharp ? "-12.5px" : "0px"}
          marginRight={note.sharp ? "-12.5px" : "0px"}
          key={note.formatted}
          onClick={() => setSelectedNote(note)}
        >
          {note.name}
        </Flex>
      ))}
    </Flex>
  );
};

export default Piano;
