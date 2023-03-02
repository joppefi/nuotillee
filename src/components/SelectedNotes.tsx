import { Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelections } from "./SelectedContext";
import { Input } from "@chakra-ui/react";

const SelectedNotes = () => {
  const { selectedNote, setSelectedNote } = useSelections();
  const [inputNotes, setInputNotes] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const lastChar = event.nativeEvent?.data?.toUpperCase();

    let value = event.target.value.toUpperCase();

    // TODO: Add ability to add notes with octaves
    if (value.length > 1 && lastChar && lastChar !== "#") {
      const arr = Array.from(value);
      arr.splice(-1, 0, " ");
      value = arr.join("");
    }

    setInputNotes(value);
  };

  const setNotes = () => {
    const notes = inputNotes.split(" ");
    setSelectedNote(notes);
  };

  return (
    <Box>
      {JSON.stringify(selectedNote)}
      <Input
        placeholder="Add notes"
        value={inputNotes}
        onChange={handleInputChange}
      />
      <Button onClick={setNotes}>Add</Button>
    </Box>
  );
};

export default SelectedNotes;
