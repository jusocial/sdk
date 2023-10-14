import { JuError } from '@/errors';


/** @group Errors */
export class AppError extends JuError {
  readonly name: string = 'AppError';
  constructor(message: string, cause?: Error) {
    super(message, 'plugin', 'Ju Profile', cause);
  }
}

/** @group Errors */
export class ProfileNotFoundError extends AppError {
  readonly name: string = 'ProfileNotFoundError';
  // @ts-ignore
  constructor() {
    const message = 'Profile not found.'
    super(message);
  }
}

/** @group Errors */
export class ManagementNotAuthorizedError extends AppError {
  readonly name: string = 'ManagementNotAuthorizedError';
  // @ts-ignore
  constructor() {
    const message = 'Management not authorized'
    super(message);
  }
}
