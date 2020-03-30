class BaseError extends Error {
  readonly code: string;

  constructor (code: string, message: string) {
    super(message);
    this.code = code;
  }

  toString (): string {
    return `${this.code}: ${this.message}`;
  }
}
