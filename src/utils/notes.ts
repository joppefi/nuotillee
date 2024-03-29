import { colors } from "./colors";

const nameRegex = /([A-G])(#|s|b)?/g;
const modifierRegex = /(#|s|b)/g;
const octaveRegex = /([0-9]+)/g;

export const notes = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export type NoteName = (typeof notes)[number];

export const getNoteColor = (note: string) => {
  const parsed = note.match(nameRegex)?.[0] as keyof typeof colors;
  if (!parsed || !colors[parsed]) {
    throw new Error(`Couldn't resolve color for ${note}`);
  }

  return colors[parsed];
};

export type Note = {
  name: NoteName;
  octave: number;
  formatted: string;
  color: string;
  sharp?: boolean;
};

export const parseNote = (note: string): Note => {
  const name = note.match(nameRegex)?.[0] as unknown as Note["name"];
  const modifier = note.match(modifierRegex)?.[0];
  const octave = note.match(octaveRegex)?.[0];

  if (!name || !octave || notes.indexOf(name) === -1) {
    throw new Error("Invalid note");
  }

  return {
    name,
    octave: parseInt(octave),
    formatted: `${name}${octave}`,
    sharp: modifier ? true : false,
    // @ts-ignore
    color: colors[name],
  };
};

export const generateNotesBetween = (startNote: string, endNote: string) => {
  const start = parseNote(startNote);
  const end = parseNote(endNote);

  const generated = [start];

  let note;

  do {
    note = shift(generated.at(-1) as Note, 1);
    generated.push(note);
  } while (note.formatted !== end.formatted);

  return generated;
};

export const generateNotes = (startNote: string, count: number) => {
  const start = parseNote(startNote);

  const generated = [start];

  let note;

  do {
    note = shift(generated.at(-1) as Note, 1);
    generated.push(note);
  } while (generated.length < count);

  return generated;
};

export const shift = (note: Note, interval: number): Note => {
  const { name, octave } = note;

  // Break the interval down into octaves and semitones
  const semitoneDiff = interval % 12;
  const octaveDiff =
    interval > 0 ? Math.floor(interval / 12) : Math.ceil(interval / 12);

  // Check index of the note
  const noteIndex = notes.indexOf(name);
  const newNoteIndex = noteIndex + semitoneDiff;

  // Check if the new note is out of bounds of the scale
  const outofBoundsHigh = newNoteIndex >= notes.length;
  const outofBoundsLow = newNoteIndex < 0;

  // Get correct index for the note
  const newNoteRealIndex = outofBoundsHigh
    ? newNoteIndex - notes.length
    : outofBoundsLow
    ? newNoteIndex + notes.length
    : newNoteIndex;

  // Check if the new note is in the next or previous octave
  const octavePass = outofBoundsHigh ? 1 : outofBoundsLow ? -1 : 0;

  const newNote = notes[newNoteRealIndex] as Note["name"];
  const newOctave = octave + octaveDiff + octavePass;

  const modifier = newNote?.match(modifierRegex)?.[0];

  return {
    name: newNote,
    octave: newOctave,
    formatted: `${newNote}${newOctave}`,
    sharp: modifier ? true : false,
    // @ts-ignore
    color: colors[newNote],
  };
};

export const sort = (notes: string[], startNote = "C") => {
  const sorted = notes.sort();

  const firstHalf = sorted.filter((note) => note >= startNote);
  const secondHalf = sorted.filter((note) => note < startNote);

  return [...firstHalf, ...secondHalf];
};
