import { Note } from "@/utils/notes";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type ContextType = {
  selectedNote: string | string[] | undefined;
  setSelectedNote: (note: string | string[] | undefined) => void;
  checkSelected: (note: Note) => SelectionStatus;
};

export type SelectionStatus = {
  selected: boolean;
  tonic?: boolean;
  degree?: number;
};

const SelectedContext = createContext<ContextType>({
  setSelectedNote: () => {},
  checkSelected: () => {
    return { selected: false };
  },
  selectedNote: undefined,
});

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNote, setSelectedNoteState] = useState<
    string | string[] | undefined
  >(undefined);

  useEffect(() => {
    const initialValue = localStorage.getItem("nuotillee-selected");
    if (initialValue) {
      setSelectedNoteState(JSON.parse(initialValue));
    }
  }, []);

  const setSelectedNote = (note: string | string[] | undefined) => {
    window.localStorage.setItem("nuotillee-selected", JSON.stringify(note));
    setSelectedNoteState(note);
  };

  const checkSelected = (note: Note): SelectionStatus => {
    if (Array.isArray(selectedNote)) {
      return {
        selected:
          selectedNote.indexOf(note.formatted) > -1 ||
          selectedNote.indexOf(note.name) > -1,
        tonic:
          selectedNote.indexOf(note.formatted) === 0 ||
          selectedNote.indexOf(note.name) === 0,
        degree:
          selectedNote.indexOf(note.name) > -1
            ? selectedNote.indexOf(note.name) + 1
            : undefined,
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
