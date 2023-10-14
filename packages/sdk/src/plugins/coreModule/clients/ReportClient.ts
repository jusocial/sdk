import {
  findReportsOperation,
  FindReportsInput,
  findReportsByKeyListOperation,
  FindReportsByKeyListInput,
  CreateReportInput,
  createReportOperation,
  FindReportsAsKeysInput,
  findReportsAsKeysOperation,
} from '../operations';
import type { Ju } from '@/Ju';
import { OperationOptions, PublicKey } from '@/types';

/**
 * This client helps to interact with the Ju Aplication Reports.
 *
 * You may access this client via the `core()` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const reportClient = ju.core().reports(app);
 * ```
 *
 * @see {@link CoreClient} The `Core` client
 * @group Modules
 */
export class ReportClient {
  constructor(readonly ju: Ju, readonly app: PublicKey) { }

  /** {@inheritDoc createReportOperation} */
  createReport(
    input: Omit<CreateReportInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(createReportOperation(
        {
          app: this.app,
          ...input
        }
      ), options);
  }

  /** {@inheritDoc findReportsOperation} */
  findReports(
    filter: Omit<FindReportsInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findReportsOperation(
        {
          app: this.app,
          ...filter
        }
      ), options);
  }

  /** {@inheritDoc findReportsOperation} */
  findReportsAsKeys(
    filter: Omit<FindReportsAsKeysInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findReportsAsKeysOperation(
        {
          app: this.app,
          ...filter
        }
      ), options);
  }

  /** {@inheritDoc findReportsByKeyListOperation} */
  getReportsByKeyList(
    input: FindReportsByKeyListInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findReportsByKeyListOperation(input), options);
  }
}