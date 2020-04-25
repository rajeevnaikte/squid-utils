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

/**
 * Error to indicate a string content is not in a valid JSON format.
 */
export class InvalidJsonFormat extends BaseError {
  /**
   * @param content the string which is not a vaild JSON.
   */
  constructor (content: string) {
    super('INVALID_JSON', `'${content}' is not in valid json format.`);
  }
}

/**
 * Error when path is not found in file system.
 */
export class PathNotFound extends BaseError {
  /**
   * @param filePath which is invalid.
   */
  constructor (filePath: string) {
    super('PATH_NOT_FOUND', `Path ${filePath} not found.`);
  }
}

/**
 * Error to indicate the file path is invalid.
 */
export class InvalidFilePath extends BaseError {
  /**
   * @param filePath which is invalid.
   */
  constructor (filePath: string) {
    super('INVALID_FILE_PATH', `Path ${filePath} is not pointing to a valid file.`);
  }
}

/**
 * Error to indicate directory path is invalid.
 */
export class InvalidDirPath extends BaseError {
  /**
   * @param filePath which is invalid.
   */
  constructor (filePath: string) {
    super('INVALID_DIR_PATH', `Path ${filePath} is not pointing to a valid directory.`);
  }
}

export class TextsBetweenNoStartEnd extends BaseError {
  constructor () {
    super('TEXTS_BETWEEN_NO_START_END', 'Must pass start and end charecter(s) to extract the enclosed text(s).');
  }
}
