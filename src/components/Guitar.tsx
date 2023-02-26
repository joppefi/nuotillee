import { generateNotes, Note } from "@/utils/notes";
import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import React from "react";
import { useSelections } from "./SelectedContext";

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
    <HStack spacing={0} mt="10" alignItems="flex-end">
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
  const { setSelectedNote, selectedNote } = useSelections();
  const markedFret = fretMarks.indexOf(number) > -1;
  return (
    <VStack>
      {markedFret && <Flex>{number}</Flex>}
      {notes.map((note, stringIndex) => (
        <Flex
          id="fret"
          key={`${stringIndex}${note.formatted}`}
          h="34px"
          w="34px"
          borderTop={!open ? "1px" : undefined}
          borderTopColor={!open ? "gray.500" : undefined}
          borderRight={stringIndex < tuning.length - 1 ? "1px" : undefined}
          mt="0 !important"
          justifyContent="center"
          alignItems="center"
        >
          <Flex mt="-30px" p="2px" position="relative" w="full" h="full">
            <Note
              note={note}
              selected={selectedNote?.formatted === note.formatted}
              onClick={() => setSelectedNote(note)}
            ></Note>
          </Flex>
        </Flex>
      ))}
    </VStack>
  );
};

type NoteProps = {
  selected: boolean;
  onClick: () => void;
  note: Note;
};

const Note = ({ selected, onClick, note }: NoteProps) => {
  return (
    <Flex
      onClick={onClick}
      // Styles for selected note
      backgroundColor={
        !note.sharp
          ? !selected
            ? `${note.color}77`
            : note.color
          : selected
          ? "gray.500"
          : undefined
      }
      opacity={!note.sharp || selected ? 1 : 0.5}
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
