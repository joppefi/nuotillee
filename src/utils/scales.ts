import { Note, shift } from "./notes";

export const generateScale = (root: Note, intervals: number[]) => {
  let cumulativeSemitones = 0;

  const otherNotes = intervals.map((interval) => {
    cumulativeSemitones += interval;
    return shift(root, cumulativeSemitones);
  });

  const scale = [root, ...otherNotes];

  return scale;
};
