import type { PublicKey } from '@solana/web3.js';
import { ReportType, Report as ReportCore, reportDiscriminator } from '@ju-protocol/ju-core';
import { toReportAccount } from '../../accounts';
import { Report, toReport } from '../../models';
import { todayToSearchInterval } from '../../helpers';
import {
  lamports,
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';

// -----------------
// Operation
// -----------------

const Key = 'FindReportsOperation' as const;

/**
 * Finds all Reports by filters.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .reports(app)
 *   .findReports(filter, options);
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findReportsOperation =
  useOperation<FindReportsOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindReportsOperation = Operation<
  typeof Key,
  FindReportsInput,
  Report[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindReportsInput = {
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
// export type FindReportsOutput = PublicKey[];

/**
 * @group Operations
 * @category Handlers
 */
export const findReportsOperationHandler: OperationHandler<FindReportsOperation> =
{
  handle: async (
    operation: FindReportsOperation,
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

    const builder = ReportCore.gpaBuilder();
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

    const res = await builder.run(ju.connection);
    scope.throwIfCanceled();


    const unparsedAccounts = res.map(({ pubkey, account }) => (
      {
        ...account,
        publicKey: pubkey,
        lamports: lamports(account.lamports),
      }
    ));

    const reports: Report[] = [];

    for (const account of unparsedAccounts) {
      try {
        const reportAccount = toReportAccount(account);

        const report = toReport(reportAccount);

        reports.push(report);

      } catch (error) {
        // TODO
      }
    }

    return reports;

  },
};