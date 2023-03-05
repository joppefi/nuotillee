import { generateNotes, Note } from "@/utils/notes";
import { Box, Flex, HStack, useColorModeValue, VStack } from "@chakra-ui/react";
import React from "react";
import { SelectionStatus, useSelections } from "./SelectedContext";

const tuning = ["E4", "B3", "G3", "D3", "A2", "E2"];
const fretCount = 24;
const strings: Note[][] = tuning.map((note) => {
  return generateNotes(note, fretCount + 1);
});
const frets = strings[0].map((note, index) => {
  return tuning.map((openString, stringIndex) => {
    return strings[stringIndex][index];
  });
});

const Guitar = () => {
  return (
    <HStack spacing={0} mt="10" w="full" alignItems="flex-end">
      {frets.map((notes, index) => (
        <Fret key={index} notes={notes} open={index === 0} number={index} />
      ))}
    </HStack>
  );
};

export default Guitar;

type FretProps = {
  notes: Note[];
  open: boolean;
  number: number;
};

const fretMarks = [1, 3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

const Fret = ({ notes, open, number }: FretProps) => {
  const { setSelectedNote, checkSelected } = useSelections();
  const markedFret = fretMarks.indexOf(number) > -1;

  const fretWidth = 100 / fretCount + 1;

  return (
    <VStack w={`${fretWidth}%`}>
      {markedFret && <Flex>{number}</Flex>}
      {notes.map((note, stringIndex) => (
        <Flex
          id="noteContainer"
          key={`${stringIndex}${note.formatted}`}
          h="0"
          w="full"
          pt="100%"
          position="relative"
          borderTop="1px"
          borderTopColor={!open ? "gray.500" : "#00000000"}
          borderRight={stringIndex < tuning.length - 1 ? "1px" : undefined}
          mt="0 !important"
          justifyContent="center"
          alignItems="center"
        >
          <Flex
            top="0"
            bottom="0"
            id="noteSquare"
            mt="-50%"
            p="4px"
            position="absolute"
            w="full"
            h="full"
          >
            <Note
              note={note}
              selectionStatus={checkSelected(note)}
              onClick={() => setSelectedNote(note.formatted)}
            ></Note>
          </Flex>
        </Flex>
      ))}
    </VStack>
  );
};

type NoteProps = {
  selectionStatus: SelectionStatus;
  onClick: () => void;
  note: Note;
};

const Note = ({ selectionStatus, onClick, note }: NoteProps) => {
  const { selected, tonic } = selectionStatus;
  const tonicColor = useColorModeValue("black", "white");

  return (
    <Flex
      onClick={onClick}
      // Styles for selected note
      backgroundColor={
        selected ? note.color : note.sharp ? undefined : `${note.color}77`
      }
      border={selected ? "2px" : undefined}
      borderColor={tonic ? tonicColor : note.color}
      color="black"
      // Rest
      justifyContent="center"
      alignItems="center"
      w="full"
      h="full"
      borderRadius="full"
    >
      {(!note.sharp || selected) && note.name}
    </Flex>
  );
};
