/** @group Errors */
export class JuError extends Error {
  readonly name: string = 'JuError';
  readonly source: JuErrorSource;
  readonly sourceDetails?: string;
  readonly cause?: Error;

  constructor(
    message: string,
    source: JuErrorSource,
    sourceDetails?: string,
    cause?: Error
  ) {
    super(message);
    this.source = source;
    this.sourceDetails = sourceDetails;
    this.cause = cause;
    this.message =
      this.message +
      `\n\nSource: ${this.getFullSource()}` +
      (this.cause ? `\n\nCaused By: ${this.cause}` : '') +
      '\n';
  }

  getCapitalizedSource(): string {
    if (this.source === 'sdk' || this.source === 'rpc') {
      return this.source.toUpperCase();
    }

    return this.source[0].toUpperCase() + this.source.slice(1);
  }

  getFullSource(): string {
    const capitalizedSource = this.getCapitalizedSource();
    const sourceDetails = this.sourceDetails ? ` > ${this.sourceDetails}` : '';

    return capitalizedSource + sourceDetails;
  }

  toString() {
    return `[${this.name}] ${this.message}`;
  }
}

/** @group Errors */
export type JuErrorSource =
  | 'sdk'
  | 'network'
  | 'rpc'
  | 'plugin'
  | 'program';
