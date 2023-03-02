import { Note } from "@/utils/notes";
import React, { createContext, ReactNode, useContext, useState } from "react";

type ContextType = {
  setSelectedNote: (note: string | string[] | null) => void;
  checkSelected: (note: Note) => SelectionStatus;
};

export type SelectionStatus = {
  selected: boolean;
  tonal?: boolean;
};

const SelectedContext = createContext<ContextType>({
  setSelectedNote: () => {},
  checkSelected: () => {
    return { selected: false };
  },
});

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNote, setSelectedNote] = useState<string | string[] | null>(
    null
  );

  const checkSelected = (note: Note) => {
    return { selected: note.formatted === selectedNote };
  };

  return (
    <SelectedContext.Provider
      value={{
        setSelectedNote,
        checkSelected,
      }}
    >
      {children}
    </SelectedContext.Provider>
  );
};

export const useSelections = () => useContext(SelectedContext);
