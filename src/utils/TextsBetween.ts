import { safeRegex } from './textParsers';
import { TextsBetweenNoStartEnd } from '../errors';

export type TextBetween = {
  text: string;
  textBetween: string;
}

/**
 * To work with text pattern with some texts enclosed within some characters.
 * e.g. <div><span>[name]</span><label>[title]</label></div>, this html has two texts in enclosed within square brackets.
 * To build template like this and replace the variables dynamically:
 * const data = { name: 'squid', title: 'fish' };
 * const textBtw = new TextsBetween('[', ']');
 * textBtw.replace(theHtml, variable => data[variable]);
 */
export class TextsBetween {
  private readonly start: string;
  private readonly end: string;
  private readonly escapeChar: string;
  private readonly forSplit: RegExp;
  private readonly forExtract: RegExp;
  private readonly escapedStartRegex: RegExp;
  private readonly escapedEndRegex: RegExp;

  /**
   * @param start - character or string indicating start of the pattern.
   * @param end - character or string indicating end of the pattern.
   * @param escapeChar - character or string used to escape the start/end symbol
   *  indicating the start/end characters as plain text.
   */
  constructor (start: string, end: string, escapeChar = '\\') {
    if (start.length === 0 || end.length === 0) throw new TextsBetweenNoStartEnd();

    this.start = start;
    this.end = end;
    this.escapeChar = escapeChar;
    const startRegex = safeRegex(start);
    const endRegex = safeRegex(end);
    const escapeCharRegex = safeRegex(escapeChar);
    this.forSplit = new RegExp(`((?<!${escapeCharRegex})${startRegex}(?:(?:(?!${startRegex}|${endRegex}).|\\n)+)?(?<!${escapeCharRegex})${endRegex})`, 'im');
    this.forExtract = new RegExp(`(?<!${escapeCharRegex})${startRegex}((((?!${startRegex}|${endRegex}).)|\\n)*)(?<!${escapeCharRegex})${endRegex}`, 'igm');
    this.escapedStartRegex = new RegExp(`${escapeCharRegex}${startRegex}`, 'igm');
    this.escapedEndRegex = new RegExp(`${escapeCharRegex}${endRegex}`, 'igm');
  }

  /**
   * Remove start and end characters.
   * @param matchText - assuming text is matched.
   */
  private trimStartEnd (matchText: string): string {
    return matchText.substring(this.start.length, matchText.length - this.end.length);
  }

  /**
   * Replace the escaped start/end characters to plain text.
   * @param text
   */
  private removeEscapes (text: string): string {
    return text
      .replace(this.escapedStartRegex, this.start)
      .replace(this.escapedEndRegex, this.end);
  }

  /**
   * Get all the texts between start and end pattern.
   * @param text
   */
  get (text: string): string[] {
    return text.match(this.forExtract)?.map(this.trimStartEnd.bind(this)) ?? [];
  }

  /**
   * Split text with the subtext enclosed in start and end as delimiter.
   * Return array also includes the text between in an object of type {TextsBetween}.
   * @param text
   */
  split (text: string): (string | TextBetween)[] {
    return text.split(this.forSplit)
      .map((part, idx) => idx % 2 === 0 ? this.removeEscapes(part) : {
        text: part,
        textBetween: this.trimStartEnd(part)
      })
      .filter(part => part);
  }

  /**
   * Replace the subtext of pattern enclosed in start and end.
   * @param text
   * @param replacement
   */
  replace (text: string, replacement: (textBetween: string) => string): string {
    return this.removeEscapes(text.replace(this.forExtract, (g1, g2) => {
      const replacementText = replacement(g2);
      return replacementText === undefined ? '' : replacementText;
    }));
  }
}