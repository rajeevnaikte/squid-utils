import { TextsBetweenNoStartEnd } from '../errors';

const charRequiringEscape = [']', '\\', '(', ')', '^'];

/**
 * Enclose each char of the text in square bracket.
 * @param text
 */
export const safeRegex = (text: string): string => {
  return `[${text.split('')
    .map(c => charRequiringEscape.includes(c) ? `\\${c}` : c)
    .join('][')}]`;
};

/**
 * Regex to find text enclosed between given start and end characters.
 * @param start
 * @param end
 * @param escapeChar
 */
export const textsBetweenRegex = (start: string, end: string, escapeChar = '\\'): RegExp => {
  const startRegex = safeRegex(start);
  const endRegex = safeRegex(end);
  const escapeCharRegex = safeRegex(escapeChar);
  return new RegExp(`(?<!${escapeCharRegex})${startRegex}((?!${startRegex}|${endRegex}).)+(?<!${escapeCharRegex})${endRegex}`, 'ig');
};

/**
 * Get higher order function to extract texts between given start characters and end characters.
 * @param start
 * @param end
 */
export const textsBetween = (start: string, end: string, escapeChar = '\\'): (text: string) => string[] => {
  if (start.length === 0 || end.length === 0) throw new TextsBetweenNoStartEnd();

  const regex = textsBetweenRegex(start, end, escapeChar);
  return (text: string) => text.match(regex)
    ?.map(item => item.substring(start.length, item.length - end.length)) ?? [];
};
