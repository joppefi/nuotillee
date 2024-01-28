import React, { useState } from "react";
import { parseNote, notes } from "@/utils/notes";
import { generateScale } from "@/utils/scales";
import { Box, Button, HStack, Select, VStack } from "@chakra-ui/react";
import { useSelections } from "./SelectedContext";
import Notation from "./Notation";

const scales = [
  {
    name: "Major",
    intervals: [2, 2, 1, 2, 2, 2],
    notationSuffix: "maj",
  },
  {
    name: "Minor",
    intervals: [2, 1, 2, 2, 1, 2],
    notationSuffix: "min",
  },
  {
    name: "Major pentatonic",
    intervals: [2, 2, 3, 2],
  },
  {
    name: "Minor pentatonic",
    intervals: [3, 2, 2, 3],
  },
];

const ScaleSelector = () => {
  const [root, setRoot] = useState<string>();
  const [scale, setIntervals] = useState<string>();

  const { selectedNote, setSelectedNote } = useSelections();

  const getScale = () => {
    if (scale && root) {
      const note = parseNote(`${root}1`);

      const { intervals } = scales[parseInt(scale)];

      const notes = generateScale(note, intervals);

      const notesNames = notes.map((note) => note.name);

      setSelectedNote(notesNames);
    }
  };

  return (
    <VStack
      border="2px"
      borderColor="gray.500"
      borderRadius="10"
      p="5"
      alignItems="flex-start"
    >
      <HStack>
        <Box>
          <Select
            placeholder="Root note"
            onChange={({ target }) => setRoot(target.value)}
          >
            {notes.map((note) => (
              <option key={note}>{note}</option>
            ))}
          </Select>
          <Select
            placeholder="Scale"
            onChange={({ target }) => setIntervals(target.value)}
          >
            {scales.map((scale, index) => (
              <option key={scale.name} value={index}>
                {scale.name}
              </option>
            ))}
          </Select>
          <Button isDisabled={!root || !scale} onClick={getScale}>
            Select scale notes
          </Button>
        </Box>
        <Box>
          {root && scale && selectedNote && (
            <Notation scale={{ root, scale: scales[parseInt(scale)] }} />
          )}
        </Box>
      </HStack>
    </VStack>
  );
};

export default ScaleSelector;
