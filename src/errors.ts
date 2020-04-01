export default class BaseError extends Error {
  readonly code: string;

  constructor (code: string, message: string) {
    super(message);
    this.code = code;
  }

  toString (): string {
    return `${this.code}: ${this.message}`;
  }
}

export class NullObjectError extends BaseError {
  constructor () {
    super('NULL_OBJECT', 'null or undefined object found when expected a value');
  }
}
