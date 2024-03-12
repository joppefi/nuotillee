import { Note, NoteName, notes, parseNote } from "@/utils/notes";
import {
  Box,
  Card,
  CardBody,
  HStack,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { WindowComponentProps } from "./types";
import { generateScale } from "@/utils/scales";

type Chord = {
  root: NoteName;
  name?: string | undefined;
};

export type ChordState = {
  chords: Chord[];
};

type ChordProps = WindowComponentProps<ChordState>;

const chordIntervalArr = [
  { name: "major", label: "", intervals: [4, 3] },
  { name: "minor", label: "m", intervals: [3, 4] },
  { name: "diminished", label: "dim", intervals: [3, 3] },
  { name: "augmented", label: "aug", intervals: [4, 4] },
  { name: "major 7th", label: "maj7", intervals: [4, 3, 4] },
  { name: "minor 7th", label: "m7", intervals: [3, 4, 3] },
  { name: "dominant 7th", label: "7", intervals: [4, 3, 3] },
  { name: "diminished 7th", label: "dim7", intervals: [3, 3, 3] },
  { name: "half-diminished 7th", label: "m7b5", intervals: [3, 4, 3, 3] },
  { name: "augmented 7th", label: "augmaj7", intervals: [4, 4, 2] },
  { name: "suspended 2nd", label: "sus2", intervals: [2, 5] },
  { name: "suspended 4th", label: "sus4", intervals: [5, 2] },
  { name: "major 6th", label: "maj6", intervals: [4, 3, 2] },
  { name: "minor 6th", label: "m6", intervals: [3, 4, 2] },
  { name: "9th", label: "9", intervals: [4, 3, 3, 4] },
  { name: "minor 9th", label: "m9", intervals: [3, 4, 3, 4] },
  { name: "major 9th", label: "maj9", intervals: [4, 3, 4, 3] },
  { name: "11th", label: "11", intervals: [4, 3, 3, 4, 3] },
  { name: "minor 11th", label: "m11", intervals: [3, 4, 3, 4, 3] },
  { name: "major 11th", label: "maj11", intervals: [4, 3, 4, 3, 3] },
  { name: "13th", label: "13", intervals: [4, 3, 3, 4, 3, 4] },
  { name: "minor 13th", label: "m13", intervals: [3, 4, 3, 4, 3, 4] },
  { name: "major 13th", label: "maj13", intervals: [4, 3, 4, 3, 3, 4] },
  { name: "add 9th", label: "add9", intervals: [4, 3, 2] },
  { name: "add 11th", label: "add11", intervals: [4, 3, 5] },
  { name: "add 13th", label: "add13", intervals: [4, 3, 7] },
];

const Chord = ({ root, name }: Chord) => {
  const chord = chordIntervalArr.find((chord) => chord.name === name);

  const notes = generateScale(parseNote(`${root}1`), chord?.intervals || []);

  return (
    <Card>
      <CardBody justifyContent="center">
        <Text textAlign="center">
          {root}
          {chord?.label}
        </Text>
        <HStack>
          {notes.map((note) => (
            <Box key={note.name}>{note.name}</Box>
          ))}
        </HStack>
      </CardBody>
    </Card>
  );
};

const ChordStack = ({ state, onStateChange }: ChordProps) => {
  const chords = state?.chords || [];

  const [root, setRoot] = useState<NoteName>("C");
  const [name, setName] = useState<string>("major");

  const handleAdd = () => {
    const newChord: Chord = {
      root,
      name,
    };

    onStateChange({
      chords: [...chords, newChord],
    });
  };

  return (
    <HStack p={2}>
      {chords.map(({ root, name }, index) => (
        <Chord key={index} root={root} name={name} />
      ))}
      <VStack>
        <Select onChange={({ target }) => setRoot(target.value as NoteName)}>
          {notes.map((note) => (
            <option key={note}>{note}</option>
          ))}
        </Select>
        <Select onChange={({ target }) => setName(target.value)}>
          {chordIntervalArr.map((chord) => (
            <option key={chord.name}>{chord.name}</option>
          ))}
        </Select>
        <Box onClick={handleAdd}>Add</Box>
      </VStack>
    </HStack>
  );
};

export default ChordStack;
