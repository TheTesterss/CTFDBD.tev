import { ColorCodes, ColorIndexes } from "../types/colors";

/**
 * 
 * @param text The text you want to colorify.
 * @param colorIndex The index of your color in the ansi table.
 * @returns The same text with ansi chars to colors it.
 */
export const colorify = (text: string, colorIndex: ColorIndexes) => `\x1b[${colorIndex}m${text}\x1b[0m`;

/**
 * 
 * @param text The text you want to colorify.
 * @returns The same text with ansi chars to colors it.
 */
export const red = (text: string) => colorify(text, ColorCodes.RED);
export const green = (text: string) => colorify(text, ColorCodes.GREEN);
export const yellow = (text: string) => colorify(text, ColorCodes.YELLOW);
export const blue = (text: string) => colorify(text, ColorCodes.BLUE);
