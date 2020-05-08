/**
 * Base error object containing keys - code, message.
 */
export class BaseError extends Error {
  readonly code: string;

  constructor (code: string, message: string) {
    super(message);
    this.code = code;
  }

  toString (): string {
    return `${this.code}: ${this.message}`;
  }
}

/**
 * Error to indicate a variable is null.
 */
export class NullObjectError extends BaseError {
  constructor () {
    super('NULL_OBJECT', 'Null or undefined object found when expected a value.');
  }
}

export class TextsBetweenNoStartEnd extends BaseError {
  constructor () {
    super('TEXTS_BETWEEN_NO_START_END', 'Must pass start and end charecter(s) to extract the enclosed text(s).');
  }
}
