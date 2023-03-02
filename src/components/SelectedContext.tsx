import { Note } from "@/utils/notes";
import React, { createContext, ReactNode, useContext, useState } from "react";

type ContextType = {
  selectedNote: string | string[] | undefined;
  setSelectedNote: (note: string | string[] | undefined) => void;
  checkSelected: (note: Note) => SelectionStatus;
};

export type SelectionStatus = {
  selected: boolean;
  tonic?: boolean;
};

const SelectedContext = createContext<ContextType>({
  setSelectedNote: () => {},
  checkSelected: () => {
    return { selected: false };
  },
  selectedNote: undefined,
});

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNote, setSelectedNote] = useState<
    string | string[] | undefined
  >(undefined);

  const checkSelected = (note: Note): SelectionStatus => {
    if (Array.isArray(selectedNote)) {
      return {
        selected:
          selectedNote.indexOf(note.formatted) > -1 ||
          selectedNote.indexOf(note.name) > -1,
        tonic:
          selectedNote.indexOf(note.formatted) === 0 ||
          selectedNote.indexOf(note.name) === 0,
      };
    }

    return {
      selected: note.formatted === selectedNote || note.name === selectedNote,
    };
  };

  return (
    <SelectedContext.Provider
      value={{
        selectedNote,
        setSelectedNote,
        checkSelected,
      }}
    >
      {children}
    </SelectedContext.Provider>
  );
};

export const useSelections = () => useContext(SelectedContext);
