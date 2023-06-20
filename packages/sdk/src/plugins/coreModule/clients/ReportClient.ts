import {
  findAllReportsOperation,
  FindAllReportsInput,
  findAllReportsByKeyListOperation,
  FindAllReportsByKeyListInput,
  CreateReportInput,
  createReportOperation,
} from '../operations';
import type { Ju } from '@/Ju';
import { OperationOptions } from '@/types';

/**
 * This client helps to interact with the Ju Aplication Reports.
 *
 * You may access this client via the `core()` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const reportClient = ju.core().report;
 * ```
 *
 * @see {@link CoreClient} The `Core` client
 * @group Modules
 */
export class ReportClient {
  constructor(readonly ju: Ju) { }

  /** {@inheritDoc createReportOperation} */
  create(input: CreateReportInput, options?: OperationOptions) {
    return this.ju
      .operations()
      .execute(createReportOperation(input), options);
  }

  /** {@inheritDoc findAllReportsOperation} */
  keysByFilter(
    input: FindAllReportsInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllReportsOperation(input), options);
  }

  /** {@inheritDoc findAllReportsByKeyListOperation} */
  findByKeyList(
    input: FindAllReportsByKeyListInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllReportsByKeyListOperation(input), options);
  }

}