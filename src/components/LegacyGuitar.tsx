import { generateNotes, Note } from "@/utils/notes";
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

type Position = {
  start: number;
  end: number;
};

const Guitar = () => {
  const [selectedOnly, setSelectedOnly] = useBoolean(true);
  const [showDegree, setShowDegree] = useBoolean();

  const [positions, setPositions] = React.useState<Position>({
    start: 0,
    end: fretCount,
  });

  const positionSliderMargin = 100 / (fretCount + 1) / 2;

  return (
    <VStack w="full" id="guitar">
      <HStack spacing={0} mt="10" w="full" alignItems="flex-end" padding="2">
        {frets.map((notes, index) => (
          <Fret
            key={index}
            notes={notes}
            open={index === 0}
            number={index}
            selectedOnly={selectedOnly}
            showDegree={showDegree}
            hidden={index < positions.start || index > positions.end}
          />
        ))}
      </HStack>
      <Box w="full" px={`${positionSliderMargin}%`}>
        <RangeSlider
          value={[positions.start, positions.end]}
          min={0}
          max={fretCount}
          onChange={([start, end]) => setPositions({ start, end })}
          onDoubleClick={() => setPositions({ start: 0, end: fretCount })}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
      </Box>
      <FormControl display="flex" alignItems="center">
        <FormLabel>Show selected notes only</FormLabel>
        <Switch isChecked={selectedOnly} onChange={setSelectedOnly.toggle} />
      </FormControl>
      <FormControl display="flex" alignItems="center">
        <FormLabel>Show scale degrees</FormLabel>
        <Switch isChecked={showDegree} onChange={setShowDegree.toggle} />
      </FormControl>
    </VStack>
  );
};

export default Guitar;

type FretProps = {
  notes: Note[];
  open: boolean;
  number: number;
  selectedOnly?: boolean;
  hidden?: boolean;
  showDegree?: boolean;
};

const fretMarks = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

const Fret = ({
  notes,
  open,
  number,
  selectedOnly,
  showDegree,
  hidden,
}: FretProps) => {
  const { setSelectedNote, checkSelected } = useSelections();
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
            <Note
              note={note}
              showDegree={showDegree}
              selectionStatus={checkSelected(note)}
              onClick={() => setSelectedNote(note.formatted)}
              visible={!selectedOnly}
              hidden={hidden}
            ></Note>
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
  selectionStatus: SelectionStatus;
  visible: boolean;
  hidden?: boolean;
  showDegree?: boolean;
  onClick: () => void;
  note: Note;
};

const Note = ({
  selectionStatus,
  onClick,
  note,
  visible,
  hidden,
  showDegree,
}: NoteProps) => {
  const { selected, tonic, degree } = selectionStatus;
  const tonicColor = useColorModeValue("black", "white");

  return (
    <Tooltip label={note.formatted} placement="top">
      <Flex
        onClick={onClick}
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
          </Flex>
        )}
      </Flex>
    </Tooltip>
  );
};
