import { Box, Button, HStack, Tag, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelections } from "./SelectedContext";
import { Input } from "@chakra-ui/react";
import { getNoteColor } from "@/utils/notes";

const SelectedNotes = () => {
  const { selectedNote, setSelectedNote } = useSelections();
  const [inputNotes, setInputNotes] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const lastChar = event.nativeEvent?.data?.toUpperCase();

    const validInputChar = /([A-G]|\d|#)/g;
    if (lastChar && !lastChar.match(validInputChar)) {
      return;
    }

    let value = event.target.value.toUpperCase();

    const notesWithoutModifiers = /([A-G])/g;

    // Force first char to be note
    if (value.length === 1 && !value.match(notesWithoutModifiers)) {
      return;
    }

    // Add space before new note
    if (value.length > 1 && lastChar && lastChar.match(notesWithoutModifiers)) {
      const arr = Array.from(value);
      if (arr.at(-2) !== " ") {
        arr.splice(-1, 0, " ");
      }
      value = arr.join("");
    }

    // Prevent modifier without a note
    if (
      lastChar &&
      lastChar === "#" &&
      !value.at(-2)?.match(notesWithoutModifiers)
    ) {
      return;
    }

    // Prevent consecutive sharp modifiers for one note
    if (
      lastChar &&
      lastChar === "#" &&
      value.length > 1 &&
      value.at(-2) === "#"
    ) {
      return;
    }

    // Prevent consecutive octave modifiers for one note
    if (lastChar && lastChar.match(/\d/g) && value.at(-2)?.match(/\d/g)) {
      return;
    }

    // Prevent consecutive spaces caused by
    if (!lastChar && value.length > 1 && value.at(-1) === " ") {
      value = value.slice(0, -1);
    }

    setInputNotes(value);
  };

  const setNotes = () => {
    const notes = inputNotes.split(" ");
    setSelectedNote(notes);
  };

  return (
    <Box>
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
        <Input
          placeholder="Add notes"
          value={inputNotes}
          onChange={handleInputChange}
        />
        <Button onClick={setNotes}>Select notes</Button>
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
