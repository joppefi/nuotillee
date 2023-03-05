import { Input, InputProps } from "@chakra-ui/react";
import React from "react";

interface NoteInputProps extends InputProps {
  onChangeNotes: (text: string) => void;
}

const NoteInput = ({ onChangeNotes, ...inputProps }: NoteInputProps) => {
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

    onChangeNotes(value);
  };

  return <Input {...inputProps} onChange={handleInputChange} />;
};

export default NoteInput;
