import {
  createAppBuilder,
  CreateAppBuilderParams
} from '../operations/app';
import {
  createProfileBuilder,
  CreateProfileBuilderParams,
  deleteProfileBuilder,
  DeleteProfileBuilderParams,
  updateProfileBuilder,
  UpdateProfileBuilderParams,
} from '../operations/profile';
import type { Ju } from '@/Ju';
import { TransactionBuilderOptions } from '@/utils';

/**
 * This client allows you to access the underlying Transaction Builders
 * for the write operations of the Core module.
 *
 * @see {@link CoreClient}
 * @group Module Builders
 */
export class CoreBuildersClient {
  constructor(protected readonly ju: Ju) {}

  /** {@inheritDoc createAppOperation} */
  createApp(
    input: CreateAppBuilderParams,
    options?: TransactionBuilderOptions
  ) {
    return createAppBuilder(this.ju, input, options);
  }

  /** {@inheritDoc createProfileBuilder} */
  createProfile(
    input: CreateProfileBuilderParams,
    options?: TransactionBuilderOptions
  ) {
    // TO-DO: Check if default app is set
    return createProfileBuilder(this.ju, input, options);
  }

  /** {@inheritDoc deleteProfileBuilder} */
  deleteProfile(
    input: DeleteProfileBuilderParams,
    options?: TransactionBuilderOptions
  ) {
    // TO-DO: Check if default app is set
    return deleteProfileBuilder(this.ju, input, options);
  }

  /** {@inheritDoc updateProfileBuilder} */
  updateProfile(
    input: UpdateProfileBuilderParams,
    options?: TransactionBuilderOptions
  ) {
    // TO-DO: Check if default app is set
    return updateProfileBuilder(this.ju, input, options);
  }
}