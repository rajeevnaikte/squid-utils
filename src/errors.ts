/**
 * Base error object containing keys - code, message.
 */
export class BaseError<T = undefined> extends Error {
  readonly code: string;
  readonly details?: T;

  constructor (code: string, message: string, details?: T) {
    super(message);
    this.code = code;
    this.details = details;
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

export class TextsBetweenInvalidInput extends BaseError {
  constructor (text: string, index: number) {
    super('TEXTS_BETWEEN_INVALID_INPUT', `Invalid character at index ${index} of text ${text}`);
  }
}

export class NestedTextsBetweenNotAllowed extends BaseError {
  constructor () {
    super('NESTED_TEXTS_BETWEEN_NOT_ALLOWED', `Nested not allowed when start and end are same.`);
  }
}

export class UnsupportedOperation extends BaseError {
  constructor (opName: string) {
    super('UNSUPPORTED_OP', `Attempt to call unsupported operation '${opName}'.`);
  }
}
