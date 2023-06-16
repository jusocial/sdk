import type { PublicKey } from '@solana/web3.js';
import { toReportAccount } from '../../accounts';
import { Report, toReport } from '../../models/Report';
import {
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';
import { GmaBuilder } from '@/utils';

// -----------------
// Operation
// -----------------

const Key = 'FindAllReportsByKeyListOperation' as const;

/**
 * Finds all Profiles data for specified pubkey list.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .findAllReportsByKeyList({ addressList };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAllReportsByKeyListOperation =
  useOperation<FindAllReportsByKeyListOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAllReportsByKeyListOperation = Operation<
  typeof Key,
  FindAllReportsByKeyListInput,
  FindAllReportsByKeyListOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAllReportsByKeyListInput = {
  /** Reports as Public keys array */
  keys: PublicKey[];

  /** Chunk size */
  chunkSize?: number;
};

/**
 * @group Operations
 * @category Outputs
 */
export type FindAllReportsByKeyListOutput = (Report | null)[];

/**
 * @group Operations
 * @category Handlers
 */
export const findAllReportsByKeyListOperationHandler: OperationHandler<FindAllReportsByKeyListOperation> =
{
  handle: async (
    operation: FindAllReportsByKeyListOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    const { commitment } = scope;
    const { chunkSize } = operation.input;
    // const { loadJsonMetadata = false } = operation.input;

    const { keys } = operation.input;

    const reportInfos = await GmaBuilder.make(
      ju,
      keys,
      {
        chunkSize,
        commitment,
      }
    ).get();
    scope.throwIfCanceled();

    const reports: Report[] = [];

    for (const account of reportInfos) {
      if (account.exists) {

        try {
          
          const reportAccount = toReportAccount(account);

          const report = toReport(reportAccount);

          reports.push(report);

        } catch (error) {
          // TODO
        }
      }
    }

    return reports;
  },
};