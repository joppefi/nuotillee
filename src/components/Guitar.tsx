import { generateNotes, Note, NoteName } from "@/utils/notes";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Switch,
  Text,
  Tooltip,
  useBoolean,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import NoteBadgeStack from "./NoteBadgeStack";
import { SelectionStatus } from "./SelectedContext";
import { WindowComponentProps } from "./types";

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

type Position = {
  start: number;
  end: number;
};

type GuitarState = {
  selectedNotes?: NoteName[];
};

type GuitarProps = WindowComponentProps<GuitarState>;

const Guitar = ({ state, onStateChange }: GuitarProps) => {
  const selectedNotes = state.selectedNotes || [];

  const [visibleFrets, setVisibleFrets] = React.useState<Position>({
    start: 0,
    end: fretCount,
  });

  const handleNoteClick = (note: Note) => {
    const noteIndex = selectedNotes.indexOf(note.name);

    if (noteIndex > -1) {
      if (noteIndex === selectedNotes.length - 1) {
        const newNotes = selectedNotes.filter((n) => n !== note.name);
        onStateChange({ selectedNotes: newNotes });
      }
    } else {
      const newNotes = [...selectedNotes, note.name];
      onStateChange({ selectedNotes: newNotes });
    }
  };

  const visibleFretsSliderMargin = 100 / (fretCount + 1) / 2;

  return (
    <VStack w="full" alignItems={"flex-start"}>
      <NoteBadgeStack notes={selectedNotes} />
      <HStack spacing={0} mt="10" w="full" alignItems="flex-end" padding="2">
        {frets.map((notes, fretNo) => (
          <Fret
            key={fretNo}
            notes={notes}
            open={fretNo === 0}
            number={fretNo}
            hidden={fretNo < visibleFrets.start || fretNo > visibleFrets.end}
          >
            {(note) => {
              const degree = selectedNotes.indexOf(note.name) + 1;
              return (
                <Note
                  note={note}
                  selectionStatus={{ tonic: false, selected: true }}
                  onClick={handleNoteClick}
                  selected={degree > 0}
                  supText={degree}
                />
              );
            }}
          </Fret>
        ))}
      </HStack>
      <Box w="full" px={`${visibleFretsSliderMargin}%`}>
        <RangeSlider
          value={[visibleFrets.start, visibleFrets.end]}
          min={0}
          max={fretCount}
          onChange={([start, end]) => setVisibleFrets({ start, end })}
          onDoubleClick={() => setVisibleFrets({ start: 0, end: fretCount })}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
      </Box>
    </VStack>
  );
};

export default Guitar;

type FretProps = {
  notes: Note[];
  open: boolean;
  number: number;
  hidden?: boolean;
  children: (note: Note) => React.ReactNode;
};

const fretMarks = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

const Fret = ({ notes, open, number, hidden, children }: FretProps) => {
  const markedFret = fretMarks.indexOf(number) > -1;

  const fretWidth = 100 / fretCount + 1;

  const backgroundColor = useColorModeValue("blackAlpha.200", "whiteAlpha.100");

  return (
    <VStack w={`${fretWidth}%`}>
      {notes.map((note, stringIndex) => (
        <Flex
          id="noteContainer"
          key={`${stringIndex}${note.formatted}`}
          h="0"
          w="full"
          pt="100%"
          backgroundColor={
            stringIndex < tuning.length - 1 && markedFret
              ? backgroundColor
              : undefined
          }
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
            {hidden ? undefined : children(note)}
          </Flex>
        </Flex>
      ))}
      <Flex h="0" w="full" pt="100%" position="relative">
        <Flex
          top="0"
          bottom="0"
          id="noteSquare"
          mt="-50%"
          position="absolute"
          w="full"
          h="full"
          justifyContent="center"
        >
          <Text variant="fret-marks">{markedFret && number}</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

type NoteProps = {
  selected?: boolean;
  tonic?: boolean;
  selectionStatus: SelectionStatus;
  visible?: boolean;
  hidden?: boolean;
  showDegree?: boolean;
  onClick: (note: Note) => void;
  note: Note;
  supText?: string | number;
};

const Note = ({
  selected,
  tonic,
  selectionStatus,
  onClick,
  note,
  visible,
  hidden,
  showDegree,
  supText,
}: NoteProps) => {
  const { degree } = selectionStatus;
  const tonicColor = useColorModeValue("black", "white");

  return (
    <Tooltip label={note.formatted} placement="top">
      <Flex
        onClick={() => onClick(note)}
        // Rest
        justifyContent="center"
        alignItems="center"
        w="full"
        h="full"
        borderRadius="full"
      >
        {!hidden && (
          <Flex
            backgroundColor={
              selected ? note.color : !visible ? undefined : `${note.color}77`
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
            {(visible || selected) && (showDegree ? degree : note.name)}
            {selected && supText ? <sup>{supText}</sup> : undefined}
          </Flex>
        )}
      </Flex>
    </Tooltip>
  );
};
