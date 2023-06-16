import type { PublicKey } from '@solana/web3.js';
import { ReportType, Report, reportDiscriminator } from '@ju-protocol/ju-core';
import {
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';

// -----------------
// Operation
// -----------------

const Key = 'FindAllReportsOperation' as const;

/**
 * Finds all Profiles for specified Application.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .findAllReportsByApp({ address };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAllReportsOperation =
  useOperation<FindAllReportsOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAllReportsOperation = Operation<
  typeof Key,
  FindAllReportsInput,
  FindAllReportsOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAllReportsInput = {
  /** The address of the Application. */
  app: PublicKey;

  /** Report initializer address (for additional filtering) */
  initializer?: PublicKey;

  /** Report target address (for additional filtering) */
  target?: PublicKey;

  /** Report type 
   * Scam = 0,
   * Abuse = 1
  */
  reportType?: ReportType;
};

/**
 * @group Operations
 * @category Outputs
 */
export type FindAllReportsOutput = PublicKey[];

/**
 * @group Operations
 * @category Handlers
 */
export const findAllReportsOperationHandler: OperationHandler<FindAllReportsOperation> =
{
  handle: async (
    operation: FindAllReportsOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const { 
      app,
      initializer,
      target,
      reportType
    } = operation.input;

    const builder =  Report.gpaBuilder();
    // Add discriminator
    builder.addFilter("accountDiscriminator", reportDiscriminator);
    
    // Add additional filters

    if (app) {
      builder.addFilter("app", app);
    }
    if (initializer) {
      builder.addFilter("initializer", initializer);
    }
    if (target) {
      builder.addFilter("target", target);
    }
    if (reportType) {
      builder.addFilter("reportType", reportType);
    }

    // Limit returned accouns data to minimum
    builder.config.dataSlice = {offset: 0, length: 0};

    const res = await builder.run(ju.connection);

    scope.throwIfCanceled();

    const reportAddresses = res.map((item) => item.pubkey)

    return reportAddresses;
  },
};