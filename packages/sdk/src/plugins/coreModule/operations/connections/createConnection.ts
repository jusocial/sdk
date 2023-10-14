import {
  createInitializeConnectionInstruction,
} from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { TransactionBuilder, TransactionBuilderOptions } from '@/utils';
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

const Key = 'CreateConnectionOperation' as const;

/**
 * Creates an Connectionlication.
 *
 * ```ts
 * await ju
 *   .core()
 *   .connections(app)
 *   .createConnection({ app, target });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const createConnectionOperation =
  useOperation<CreateConnectionOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type CreateConnectionOperation = Operation<
  typeof Key,
  CreateConnectionInput,
  CreateConnectionOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type CreateConnectionInput = {
  /** Current App address. */
  app: PublicKey;

  /** Connection Target */
  target: PublicKey;

  /** Data might be passed into Connecting Processor */
  externalProcessingData?: string;
};

/**
 * @group Operations
 * @category Outputs
 */
export type CreateConnectionOutput = {
  /** The address of the Connection. */
  connectionAddress: PublicKey;

  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const createConnectionOperationHandler: OperationHandler<CreateConnectionOperation> =
{
  async handle(
    operation: CreateConnectionOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<CreateConnectionOutput> {
    const builder = createConnectionBuilder(
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

    // TO-DO: return successful response?

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
export type CreateConnectionBuilderParams = Omit<
  CreateConnectionInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};;

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type CreateConnectionBuilderContext = Omit<
  CreateConnectionOutput,
  'response' | 'connection'
>;

/**
 * Creates an Connection.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .connection()
 *   .builders()
 *   .createConnection({ app, target })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const createConnectionBuilder = (
  ju: Ju,
  params: CreateConnectionBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<CreateConnectionBuilderContext> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;
  const { 
    app,
    target,
    externalProcessingData = null
  } = params;

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

  const connectionPda = ju
    .core()
    .pdas()
    .connection({
      app,
      initializer,
      target,
      programs,
    });

  return (
    TransactionBuilder.make<CreateConnectionBuilderContext>()
      .setFeePayer(payer)
      .setContext({
        connectionAddress: connectionPda,
      })

      // Create and initialize the Connection account.
      .add({
        instruction: createInitializeConnectionInstruction(
          {
            app,
            connection: connectionPda,
            initializer,
            target,
            authority: toPublicKey(authority),
          },
          {
            externalProcessingData
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'createConnection',
      })
  );
};