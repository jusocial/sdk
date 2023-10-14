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

const Key = 'FindReportsByKeyListOperation' as const;

/**
 * Finds all Profiles data for specified pubkey list.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .reports(app)
 *   .findReportsByKeyList({ addressList };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findReportsByKeyListOperation =
  useOperation<FindReportsByKeyListOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindReportsByKeyListOperation = Operation<
  typeof Key,
  FindReportsByKeyListInput,
  FindReportsByKeyListOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindReportsByKeyListInput = {
  /** Reports as Public keys array */
  keys: PublicKey[];

  /** Chunk size */
  chunkSize?: number;
};

/**
 * @group Operations
 * @category Outputs
 */
export type FindReportsByKeyListOutput = (Report | null)[];

/**
 * @group Operations
 * @category Handlers
 */
export const findReportsByKeyListOperationHandler: OperationHandler<FindReportsByKeyListOperation> =
{
  handle: async (
    operation: FindReportsByKeyListOperation,
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