import React from "react";

import { Box } from "@chakra-ui/react";
import abcjs from "abcjs";

import { useSelections } from "./SelectedContext";

import { sort } from "@/utils/notes";

type ScaleProps = {
  scale: {
    root: string;
    scale: {
      notationSuffix: string;
    };
  };
};

const Notation = ({ scale }: ScaleProps) => {
  const { selectedNote } = useSelections();

  React.useEffect(() => {
    const renderNotation = () => {
      console.log("rendering notation", selectedNote);
      if (Array.isArray(selectedNote)) {
        const noteNames = sort(selectedNote).join(" ");

        const notation = [
          `K:${scale.root}${scale.scale.notationSuffix}`,
          `C D E F G A B`,
          `w:${noteNames}`,
          `c d e f g a b`,
          `w:${noteNames}`,
        ];

        console.log(notation.join("\n"));

        abcjs.renderAbc("notation", notation.join("\n"), {
          staffwidth: 400,
        });
      }
    };

    renderNotation();
  }, [scale, selectedNote]);

  return (
    <Box width="400px">
      <Box id="notation"></Box>
    </Box>
  );
};

export default Notation;
