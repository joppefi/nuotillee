import { Box, Container, HStack } from "@chakra-ui/react";
import React from "react";
import { useSelections } from "../SelectedContext";
import SelectedNotes, { NoteBadge } from "../SelectedNotes";

const TopBar = () => {
  const { selectedNote, setSelectedNote } = useSelections();

  return (
    <Box w="full" backgroundColor="blackAlpha.500">
      <Container maxW="4xl" justifyContent="flex-start" py="4">
        {selectedNote && (
          <HStack>
            {Array.isArray(selectedNote) ? (
              selectedNote.map((note) => <NoteBadge key={note} note={note} />)
            ) : (
              <NoteBadge note={selectedNote} />
            )}
          </HStack>
        )}
      </Container>
    </Box>
  );
};

export default TopBar;
