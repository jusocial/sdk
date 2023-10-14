import {
  ReportType,
  createInitializeReportInstruction,
} from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { Option, TransactionBuilder, TransactionBuilderOptions } from '@/utils';
import {
  makeConfirmOptionsFinalizedOnMainnet,
  Operation,
  OperationHandler,
  OperationScope,
  PublicKey,
  toPublicKey,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';

// -----------------
// Operation
// -----------------

const Key = 'CreateReportOperation' as const;

/**
 * Creates an Reportlication.
 *
 * ```ts
 * await ju
 *   .core()
 *   .reports(app)
 *   .createReport();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const createReportOperation =
  useOperation<CreateReportOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type CreateReportOperation = Operation<
  typeof Key,
  CreateReportInput,
  CreateReportOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type CreateReportInput = {
  /** Current App address. */
  app: PublicKey;

  /** Report Target */
  target: PublicKey;

  /** Report Type */
  reportType: ReportType;  

  /** Notofication  */
  notificationString: Option<string>; 
};

/**
 * @group Operations
 * @category Outputs
 */
export type CreateReportOutput = {
  /** The address of the Report. */
  reportAddress: PublicKey;

  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const createReportOperationHandler: OperationHandler<CreateReportOperation> =
{
  async handle(
    operation: CreateReportOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<CreateReportOutput> {
    const builder = createReportBuilder(
      ju,
      operation.input,
      scope
    );

    const confirmOptions = makeConfirmOptionsFinalizedOnMainnet(
      ju,
      scope.confirmOptions
    );
    const output = await builder.sendAndConfirm(ju, confirmOptions);
    scope.throwIfCanceled();

    return { ...output };
  },
};

// -----------------
// Builder
// -----------------

/**
 * @group Transaction Builders
 * @category Inputs
 */
export type CreateReportBuilderParams = Omit<
  CreateReportInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};;

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type CreateReportBuilderContext = Omit<
  CreateReportOutput,
  'response' | 'report'
>;

/**
 * Creates an Report.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .report()
 *   .builders()
 *   .createReport({ app, target, reportType })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const createReportBuilder = (
  ju: Ju,
  params: CreateReportBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<CreateReportBuilderContext> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;
  const { app, target, reportType, notificationString } = params;

  // Accounts.
  const authority = ju.identity();

  // PDAs.
  const initializer = ju
    .core()
    .pdas()
    .profile({
      app,
      authority: toPublicKey(authority),
      programs,
    });

  const reportPda = ju
    .core()
    .pdas()
    .report({
      app,
      initializer,
      target,
      programs,
    });

  return (
    TransactionBuilder.make<CreateReportBuilderContext>()
      .setFeePayer(payer)
      .setContext({
        reportAddress: reportPda,
      })

      // Create and initialize the Report account.
      .add({
        instruction: createInitializeReportInstruction(
          {
            app,
            report: reportPda,
            initializer,
            target,
            authority: toPublicKey(authority),
          },
          {
            data: {
              reportType,
              notificationString
            }
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'createReport',
      })
  );
};