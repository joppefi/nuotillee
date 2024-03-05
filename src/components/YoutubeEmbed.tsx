import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
  Skeleton,
} from "@chakra-ui/react";
import React from "react";
import { WindowComponentProps } from "./types";

type YoutubeEmbedState = {
  url: string;
};

type YoutubeEmbedProps = WindowComponentProps<YoutubeEmbedState>;

const YoutubeEmbed = ({ state, onStateChange }: YoutubeEmbedProps) => {
  const url = state?.url || "";
  return (
    <Box w="sm">
      <Skeleton isLoaded={url.length > 0}>
        <iframe
          width="100%"
          height="280"
          src={url}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      </Skeleton>
      <Editable
        placeholder="Add embed url"
        value={url}
        onChange={(evt) => onStateChange({ url: evt })}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    </Box>
  );
};

export default YoutubeEmbed;
