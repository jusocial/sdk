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
  
  /** Searchable number of day  (for additional filtering) */
  searchableDay?: number;
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
      searchableDay
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
    if (searchableDay) {
      builder.addFilter("searchableDay", searchableDay)
    }

    // Limit returned accouns data to minimum
    builder.config.dataSlice = { offset: 0, length: 0 };

    const res = await builder.run(ju.connection);

    scope.throwIfCanceled();

    const reportAddresses = res.map((item) => item.pubkey)

    return reportAddresses;
  },
};