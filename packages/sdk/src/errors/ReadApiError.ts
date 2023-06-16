import { JuError } from './JuError';

/** @group Errors */
export class ReadApiError extends JuError {
  readonly name: string = 'ReadApiError';
  constructor(message: string, cause?: Error) {
    super(message, 'rpc', undefined, cause);
  }
}
