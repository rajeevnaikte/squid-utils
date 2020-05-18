import { safeRegex } from './textParsers';
import { NestedTextsBetweenNotAllowed, TextsBetweenInvalidInput, TextsBetweenNoStartEnd } from '../errors';

export type TextBetween = {
  text: string;
  textBetween: string;
}

class Builder {
  readonly start: string;
  readonly end: string;
  escapeChar = '\\';
  allowNested = false;
  ignoreStaleStart = false;

  /**
   * Start and end char(s) are required to fetch texts between.
   * @param start
   * @param end
   */
  constructor (start: string, end: string) {
    this.start = start;
    this.end = end;
  }

  /**
   * Optionally provide custom escape char to use inside the texts between start and end.
   * @param escapeChar - Default is `\`.
   */
  withEscapeChar (escapeChar: string): Builder {
    this.escapeChar = escapeChar;
    return this;
  }

  /**
   * Allow nested start end symbols to indicate nested variables. i.e. variable inside variable.
   * E.g. [i18n:Hello [name], welcome!]
   */
  withNestedAllowed (): Builder {
    if (this.start === this.end) {
      throw new NestedTextsBetweenNotAllowed();
    }
    this.allowNested = true;
    return this;
  }

  /**
   * Ignore if there is start symbol near end of the text without a following end symbol.
   */
  withStaleStartIgnored (): Builder {
    this.ignoreStaleStart = true;
    return this;
  }

  /**
   * Get an instance of `TextsBetween`.
   */
  build (): TextsBetween {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new TextsBetween(this.start, this.end, this.escapeChar, this.allowNested, this.ignoreStaleStart);
  }
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
  private readonly startEndSame: boolean;
  private readonly startEscapeSame: boolean;
  private readonly endEscapeSame: boolean;
  private readonly escapeChar: string;
  private readonly allowNested: boolean;
  private readonly ignoreStaleStart: boolean;
  private readonly escapedStartRegex: RegExp;
  private readonly escapedEndRegex: RegExp;

  /**
   * Builder class to build an instance of `TextsBetween` with required and optional properties.
   */
  static Builder = Builder;

  /**
   * @param start - character or string indicating start of the pattern.
   * @param end - character or string indicating end of the pattern.
   * @param escapeChar - character or string used to escape the start/end symbol
   *  indicating the start/end characters as plain text.
   */
  constructor (start: string, end: string, escapeChar = '\\',
                       allowNested = false, ignoreStaleStart = false) {
    if (start.length === 0 || end.length === 0) throw new TextsBetweenNoStartEnd();

    this.start = start;
    this.end = end;
    this.startEndSame = start === end;
    this.escapeChar = escapeChar;
    this.startEscapeSame = start === escapeChar;
    this.endEscapeSame = end === escapeChar;
    this.allowNested = allowNested;
    this.ignoreStaleStart = ignoreStaleStart;
    const startRegex = safeRegex(start);
    const endRegex = safeRegex(end);
    const escapeCharRegex = safeRegex(escapeChar);
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
   * Check if the char at given charIdx in given text is escaped with escapeChar defined in this instance.
   * @param charIdx
   * @param text
   */
  private isEscaped (charIdx: number, text: string): boolean {
    const escapeCharIdx = charIdx - this.escapeChar.length;
    return escapeCharIdx > -1 && text.substr(escapeCharIdx, this.escapeChar.length) === this.escapeChar;
  }

  /**
   * Get start-end indices pairs for texts between.
   * @param text
   */
  private getIndices (text: string): number[] {
    const indices: number[] = [];
    let openStartCount = 0;

    let startMatchIdx = 0;
    let endMatchIdx = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text.charAt(i);

      if (!(openStartCount > 0 && this.startEndSame)) {
        if (c === this.start.charAt(startMatchIdx)) {
          startMatchIdx++;
        } else {
          startMatchIdx = 0;
        }

        // Start found.
        if (startMatchIdx === this.start.length) {
          startMatchIdx = 0;
          // Start escaped? Continue the search.
          if (this.isEscaped(i - this.start.length + 1, text)) {
            continue;
          }
          // Actual start found.
          openStartCount++;
          if (openStartCount === 1) {
            indices.push(i - this.start.length + 1);
          }
          // If nested not allowed, then cannot have start inside texts between.
          else if (!this.allowNested) {
            throw new TextsBetweenInvalidInput(text, i);
          }
          continue;
        }
      }

      // If start open then only look for end.
      if (openStartCount > 0) {
        if (c === this.end.charAt(endMatchIdx)) {
          endMatchIdx++;
        } else {
          endMatchIdx = 0;
        }

        // End found.
        if (endMatchIdx === this.end.length) {
          endMatchIdx = 0;
          // End escaped? Continue the search.
          const endCharIdx = i - this.end.length + 1;
          if (this.endEscapeSame && this.startEscapeSame) {
            if (text.substr(i + 1, this.end.length) === this.end) {
              i += this.end.length;
              continue;
            }
          } else if (this.isEscaped(endCharIdx, text)) {
            continue;
          }
          // Actual start found.
          openStartCount--;
          if (openStartCount === 0) {
            indices.push(i);
          }
        }
      }
    }

    if (openStartCount > 0) {
      if (this.ignoreStaleStart) {
        // If ignoring stale symbols, then remove the stale index as well, if any present.
        if (indices.length % 2 !== 0) {
          indices.pop();
        }
      } else {
        throw new TextsBetweenInvalidInput(text, indices[indices.length - 1]);
      }
    }

    return indices;
  }

  /**
   * Parse given text with defined start-end symbols and other properties.
   * Returns object of functions to get, split, replace.
   * @param text
   */
  parse (text: string) {
    let splitParts: (string | TextBetween)[] = [];
    const indices = this.getIndices(text);
    if (indices.length === 0) {
      splitParts.push(text);
    } else {
      if (indices[0] !== 0) {
        splitParts.push(text.substring(0, indices[0]));
      }
      for (let i = 0; i < indices.length - 1; i = i + 2) {
        const matchText = text.substring(indices[i], indices[i + 1] + 1);
        splitParts.push({
          text: matchText,
          textBetween: this.trimStartEnd(matchText)
        });
        if (indices[i + 2]) {
          splitParts.push(text.substring(indices[i + 1] + 1, indices[i + 2]));
        }
      }
      if (indices[indices.length - 1] + 1 !== text.length) {
        splitParts.push(text.substring(indices[indices.length - 1] + 1));
      }
    }

    splitParts = splitParts
      .map(part => {
        // Remove escaped from all after parsing.
        if (typeof part === 'string') {
          // Filter out empty texts.
          if (part.length === 0) return undefined;
          return this.removeEscapes(part);
        } else {
          part.textBetween = this.removeEscapes(part.textBetween);
          return part;
        }
      })
      .filter(part => part) as (string | TextBetween)[];

    return {
      /**
       * Get all the texts between start and end pattern.
       */
      get: (): string[] => splitParts
        .filter(part => typeof part !== 'string')
        .map(part => (part as TextBetween).textBetween),

      /**
       * Split text with the subtext enclosed in start and end as delimiter.
       * Return array also includes the text between in an object of type {TextsBetween}.
       */
      split: () => splitParts,

      /**
       * Replace the subtext of pattern enclosed in start and end.
       * @param replacement
       */
      replace: (replacement: (textBetween: string) => string): string => splitParts
        .map(part => typeof part === 'string' ? part : replacement(part.textBetween))
        .join('')
    };
  }
}
