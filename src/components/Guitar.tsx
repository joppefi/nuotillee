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
    <HStack spacing={0} mt="10">
      {frets.map((notes, index) => (
        <Fret key={index} notes={notes} open={index === 0} />
      ))}
    </HStack>
  );
};

export default Guitar;

type FretProps = {
  notes: Note[];
  open: boolean;
};

const Fret = ({ notes, open }: FretProps) => {
  const { setSelectedNote, selectedNote } = useSelections();
  return (
    <VStack>
      {notes.map((note, stringIndex) => (
        <Flex
          id="fret"
          key={`${stringIndex}${note.formatted}`}
          h="30px"
          borderTop={!open ? "1px" : undefined}
          borderRight={stringIndex < tuning.length - 1 ? "1px" : undefined}
          w="30px"
          mt="0 !important"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            onClick={() => setSelectedNote(note)}
            backgroundColor={
              selectedNote?.formatted === note.formatted
                ? "green"
                : !note.sharp
                ? note.color
                : "white"
            }
            mt="-30px"
            position="relative"
          >
            {note.name}
          </Box>
        </Flex>
      ))}
    </VStack>
  );
};
