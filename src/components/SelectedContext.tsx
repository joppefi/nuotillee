import { Note } from "@/utils/notes";
import React, { createContext, ReactNode, useContext, useState } from "react";

type ContextType = {
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
};

const SelectedContext = createContext<ContextType>({
  selectedNote: null,
  setSelectedNote: () => {},
});

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  return (
    <SelectedContext.Provider
      value={{
        selectedNote,
        setSelectedNote,
      }}
    >
      {children}
    </SelectedContext.Provider>
  );
};

export const useSelections = () => useContext(SelectedContext);
