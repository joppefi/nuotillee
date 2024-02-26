import { Box, Container } from "@chakra-ui/react";
import React from "react";
import SelectedNotes from "../SelectedNotes";

const TopBar = () => {
  return (
    <Box w="full" backgroundColor="blackAlpha.500">
      <Container maxW="4xl" justifyContent="flex-start">
        <SelectedNotes />
      </Container>
    </Box>
  );
};

export default TopBar;
