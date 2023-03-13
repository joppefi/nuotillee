import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { generateNotesBetween, Note } from "@/utils/notes";
import { SelectionStatus, useSelections } from "./SelectedContext";

const Piano = () => {
  const notes = generateNotesBetween("A0", "C8");
  const { setSelectedNote, checkSelected } = useSelections();

  const ref = useRef<HTMLDivElement>(null);
  const [pianoWidth, setPianoWidth] = useState<number | undefined>(undefined);

  const keyCount = notes.filter((note) => !note.sharp).length;

  useLayoutEffect(() => {
    setPianoWidth(ref.current?.offsetWidth);
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      setPianoWidth(ref.current?.offsetWidth);
      console.log(ref.current?.offsetWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Flex w="full" ref={ref}>
      {notes.map((note) => (
        <Key
          key={note.formatted}
          selectionStatus={checkSelected(note)}
          note={note}
          width={pianoWidth ? pianoWidth / keyCount : 25}
          onClick={() => setSelectedNote(note.formatted)}
        />
      ))}
    </Flex>
  );
};

type KeyProps = {
  selectionStatus: SelectionStatus;
  note: Note;
  onClick: () => void;
  width: number;
};

const Key = ({ selectionStatus, note, width, onClick }: KeyProps) => {
  const { selected } = selectionStatus;
  return (
    <Flex
      border="1px"
      borderColor="gray.400"
      w={`${width}px`}
      h={note.sharp ? `${width * 3}px` : undefined}
      pt={!note.sharp ? `${width * 3}px` : undefined}
      justifyContent="center"
      alignItems="flex-end"
      backgroundColor={selected ? note.color : note.sharp ? "black" : "white"}
      color={note.sharp ? "white" : "black"}
      position={note.sharp ? "relative" : undefined}
      marginLeft={note.sharp ? `-${width / 2}px` : "0px"}
      marginRight={note.sharp ? `-${width / 2}px` : "0px"}
      key={note.formatted}
      onClick={onClick}
    >
      <Text fontSize="xs" my="1">
        {!note.sharp && note.name}
      </Text>
    </Flex>
  );
};

export default Piano;
