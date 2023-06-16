import {
  createAccountBuilder,
  CreateAccountBuilderParams,
  transferSolBuilder,
  TransferSolBuilderParams,
} from './operations';
import type { Ju } from '@/Ju';
import { TransactionBuilderOptions } from '@/utils';

/**
 * This client allows you to access the underlying Transaction Builders
 * for the write operations of the System module.
 *
 * @see {@link SystemClient}
 * @group Module Builders
 * */
export class SystemBuildersClient {
  constructor(protected readonly ju: Ju) {}

  /** {@inheritDoc createAccountBuilder} */
  createAccount(
    input: CreateAccountBuilderParams,
    options?: TransactionBuilderOptions
  ) {
    return createAccountBuilder(this.ju, input, options);
  }

  /** {@inheritDoc transferSolBuilder} */
  transferSol(
    input: TransferSolBuilderParams,
    options?: TransactionBuilderOptions
  ) {
    return transferSolBuilder(this.ju, input, options);
  }
}
