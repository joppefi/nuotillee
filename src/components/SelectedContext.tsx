import { Note } from "@/utils/notes";
import React, { createContext, ReactNode, useContext, useState } from "react";

type ContextType = {
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  checkSelected: (note: Note) => boolean;
};

const SelectedContext = createContext<ContextType>({
  selectedNote: null,
  setSelectedNote: () => {},
  checkSelected: () => false,
});

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const checkSelected = (note: Note) => {
    return note.formatted === selectedNote?.formatted;
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
