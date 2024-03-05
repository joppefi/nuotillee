import {
  Box,
  Editable,
  EditablePreview,
  EditableTextarea,
} from "@chakra-ui/react";
import React from "react";
import { WindowComponentProps } from "./types";

type TextBoxState = {
  content: string;
};

type TextBoxProps = WindowComponentProps<TextBoxState>;

const TextBox = ({ state, onStateChange }: TextBoxProps) => {
  const content = state?.content || "";

  const handleChange = (content: string) => {
    onStateChange({ content });
  };

  return (
    <Box p="2">
      <pre>
        <Editable
          placeholder="Start by writing text"
          value={content}
          onChange={handleChange}
        >
          <EditablePreview />
          <EditableTextarea />
        </Editable>
      </pre>
    </Box>
  );
};

export default TextBox;
