const nameRegex = /([A-G])(#|s|b)?/g;
const modifierRegex = /(#|s|b)/g;
const octaveRegex = /([0-9]+)/g;

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export type Note = {
  name: string;
  octave: number;
  formatted: string;
  sharp?: boolean;
};

export const parseNote = (note: string): Note => {
  const name = note.match(nameRegex)?.[0];
  const modifier = note.match(modifierRegex)?.[0];
  const octave = note.match(octaveRegex)?.[0];

  if (!name || !octave) {
    throw new Error("Invalid note");
  }

  return {
    name,
    octave: parseInt(octave),
    formatted: `${name}${octave}`,
    sharp: modifier ? true : false,
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

  const newNote = notes[newNoteRealIndex];
  const newOctave = octave + octaveDiff + octavePass;

  const modifier = newNote?.match(modifierRegex)?.[0];

  return {
    name: newNote,
    octave: newOctave,
    formatted: `${newNote}${newOctave}`,
    sharp: modifier ? true : false,
  };
};
