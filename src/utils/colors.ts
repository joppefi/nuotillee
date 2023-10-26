const averageColors = (color1: string, color2: string) => {
  const hex1 = color1.replace("#", "");
  const hex2 = color2.replace("#", "");

  const r1 = parseInt(hex1.slice(0, 2), 16);
  const g1 = parseInt(hex1.slice(2, 4), 16);
  const b1 = parseInt(hex1.slice(4, 6), 16);

  const r2 = parseInt(hex2.slice(0, 2), 16);
  const g2 = parseInt(hex2.slice(2, 4), 16);
  const b2 = parseInt(hex2.slice(4, 6), 16);

  const averageR = Math.round((r1 + r2) / 2);
  const averageG = Math.round((g1 + g2) / 2);
  const averageB = Math.round((b1 + b2) / 2);

  return `#${averageR.toString(16)}${averageG.toString(16)}${averageB.toString(
    16
  )}`;
};

export const colors = {
  C: "#5db9e2",
  "C#": averageColors("#5db9e2", "#705ce1"), // Average color between C and D
  D: "#705ce1",
  "D#": averageColors("#705ce1", "#dd5fdd"), // Average color between D and E
  E: "#dd5fdd",
  F: "#e0655e",
  "F#": averageColors("#e0655e", "#e0c95f"), // Average color between F and G
  G: "#e0c95f",
  "G#": averageColors("#e0c95f", "#8ddf5f"), // Average color between G and A
  A: "#8ddf5f",
  "A#": averageColors("#8ddf5f", "#5fe09f"), // Average color between A and B
  B: "#5fe09f",
};
