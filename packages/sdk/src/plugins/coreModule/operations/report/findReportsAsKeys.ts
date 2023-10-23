import type { PublicKey } from '@solana/web3.js';
import { ReportType, Report, reportDiscriminator } from '@ju-protocol/ju-core';
import {
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';
import { todayToSearchInterval } from '../../helpers';

// -----------------
// Operation
// -----------------

const Key = 'FindReportsAsKeysOperation' as const;

/**
 * Finds Reports by filters (as Public keys Array).
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .reports(app)
 *   .findReportsAsKeysAsKeys(filter, options);
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findReportsAsKeysOperation =
  useOperation<FindReportsAsKeysOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindReportsAsKeysOperation = Operation<
  typeof Key,
  FindReportsAsKeysInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindReportsAsKeysInput = {
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
  
  /** Is event happens in 7-day-period  (for additional filtering) */
  isIn7Days?: boolean;

  /** Is event happens in 3-day-period  (for additional filtering) */
  isIn3Days?: boolean;

  /** Is event happens today  (for additional filtering) */
  isToday?: boolean;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindReportsAsKeysOutput = PublicKey[];

/**
 * @group Operations
 * @category Handlers
 */
export const findReportsAsKeysOperationHandler: OperationHandler<FindReportsAsKeysOperation> =
{
  handle: async (
    operation: FindReportsAsKeysOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      app,
      initializer,
      target,
      reportType,
      isIn7Days,
      isIn3Days,
      isToday
    } = operation.input;

    const builder = Report.gpaBuilder();
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
    if (isIn7Days) {
      builder.addFilter("creationWeek", todayToSearchInterval(7))
    }
    if (isIn3Days) {
      builder.addFilter("creation3Day", todayToSearchInterval(3))
    }
    if (isToday) {
      builder.addFilter("creationDay", todayToSearchInterval(1))
    }

    // Limit returned accouns data to minimum
    builder.config.dataSlice = { offset: 0, length: 0 };

    const res = await builder.run(ju.connection);

    scope.throwIfCanceled();

    const reportAddresses = res.map((item) => item.pubkey)

    return reportAddresses;
  },
};