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
