import React, { useState } from "react";
import { Box, Button, HStack, Tag, VStack } from "@chakra-ui/react";
import { useSelections } from "./SelectedContext";
import { getNoteColor } from "@/utils/notes";
import NoteInput from "./NoteInput";

const SelectedNotes = () => {
  const { selectedNote, setSelectedNote } = useSelections();
  const [inputNotes, setInputNotes] = useState<string>("");

  const setNotes = () => {
    const notes = inputNotes.split(" ");
    setSelectedNote(notes);
  };

  return (
    <Box border="2px" borderColor="gray.500" borderRadius="10" p="5">
      <VStack alignItems="flex-start">
        {selectedNote && (
          <HStack>
            {Array.isArray(selectedNote) ? (
              selectedNote.map((note) => <NoteBadge key={note} note={note} />)
            ) : (
              <NoteBadge note={selectedNote} />
            )}
          </HStack>
        )}
        <NoteInput
          placeholder="Add notes"
          value={inputNotes}
          onChangeNotes={(notes) => setInputNotes(notes)}
        />
        <Button isDisabled={inputNotes.length === 0} onClick={setNotes}>
          Select notes
        </Button>
      </VStack>
    </Box>
  );
};

type NoteBadgeProps = {
  note: string;
};

const NoteBadge = ({ note }: NoteBadgeProps) => {
  return (
    <Box>
      <Tag
        size="lg"
        key={note}
        borderRadius="full"
        bgColor={getNoteColor(note)}
        color="black"
      >
        {note}
      </Tag>
    </Box>
  );
};

export default SelectedNotes;
