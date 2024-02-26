type Position = {
  x: number;
  y: number;
};

export const formatPosition = (position: Position) => {
  return `translate(${position.x}px, ${position.y}px)`;
};

export const formatPositionChildren = (position: Position) => {
  return `translate(${Math.abs(position.x)}px, ${position.y}px)`;
};
