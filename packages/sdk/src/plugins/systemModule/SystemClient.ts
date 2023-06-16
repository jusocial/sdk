import {
  CreateAccountInput,
  createAccountOperation,
  TransferSolInput,
  transferSolOperation,
} from './operations';
import { SystemBuildersClient } from './SystemBuildersClient';
import type { Ju } from '@/Ju';
import { OperationOptions } from '@/types';

/**
 * This is a client for the System module.
 *
 * It enables us to interact with the System program in order to
 * create uninitialized accounts and transfer SOL.
 *
 * You may access this client via the `system()` method of your `Ju` instance.
 *
 * ```ts
 * const systemClient = ju.system();
 * ```
 *
 * @example
 * You can create a new uninitialized account with a given space in bytes
 * using the code below.
 *
 * ```ts
 * const { newAccount } = await ju.system().createAccount({ space: 42 });
 * ```
 *
 * @group Modules
 */
export class SystemClient {
  constructor(protected readonly ju: Ju) {}

  /**
   * You may use the `builders()` client to access the
   * underlying Transaction Builders of this module.
   *
   * ```ts
   * const buildersClient = ju.system().builders();
   * ```
   */
  builders() {
    return new SystemBuildersClient(this.ju);
  }

  /** {@inheritDoc createAccountOperation} */
  createAccount(input: CreateAccountInput, options?: OperationOptions) {
    return this.ju
      .operations()
      .execute(createAccountOperation(input), options);
  }

  /** {@inheritDoc transferSolOperation} */
  transferSol(input: TransferSolInput, options?: OperationOptions) {
    return this.ju
      .operations()
      .execute(transferSolOperation(input), options);
  }
}
