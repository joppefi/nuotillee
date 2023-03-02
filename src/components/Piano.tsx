import { generateNotesBetween, Note } from "@/utils/notes";
import { Flex } from "@chakra-ui/react";
import React from "react";
import { SelectionStatus, useSelections } from "./SelectedContext";

const Piano = () => {
  const notes = generateNotesBetween("A0", "C8");
  const { setSelectedNote, checkSelected } = useSelections();
  return (
    <Flex>
      {notes.map((note) => (
        <Key
          key={note.formatted}
          selectionStatus={checkSelected(note)}
          note={note}
          onClick={() => setSelectedNote(note.formatted)}
        />
      ))}
    </Flex>
  );
};

type KeyProps = {
  selectionStatus: SelectionStatus;
  note: Note;
  onClick: () => void;
};

const Key = ({ selectionStatus, note, onClick }: KeyProps) => {
  const { selected } = selectionStatus;
  return (
    <Flex
      border="1px"
      borderColor="gray.400"
      w="25px"
      h={note.sharp ? "75px" : "100px"}
      justifyContent="center"
      alignItems="flex-end"
      backgroundColor={selected ? note.color : note.sharp ? "black" : "white"}
      color={note.sharp ? "white" : "black"}
      position={note.sharp ? "relative" : undefined}
      marginLeft={note.sharp ? "-12.5px" : "0px"}
      marginRight={note.sharp ? "-12.5px" : "0px"}
      key={note.formatted}
      onClick={onClick}
    >
      {!note.sharp && note.name}
    </Flex>
  );
};

export default Piano;
