export const DIAL_DIGITS = 4;
export const ITEM_HEIGHT = 56;

export const CHARS = [
  ...Array.from({ length: 10 }, (_, i) => i.toString()),
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
];
