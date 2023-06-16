import {
  createUpdateConnectionInstruction
} from '@ju-protocol/ju-core';
import { PublicKey } from '@solana/web3.js';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { TransactionBuilder, TransactionBuilderOptions } from '@/utils';
import {
  makeConfirmOptionsFinalizedOnMainnet,
  Operation,
  OperationHandler,
  OperationScope,
  toPublicKey,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';

// -----------------
// Operation
// -----------------

const Key = 'UpdateConnectionOperation' as const;

/**
 * Uodates an existing Connection.
 *
 * ```ts
 * await ju
 *   .core()
 *   .updateConnection({ app, initializer, status });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const updateConnectionOperation =
  useOperation<UpdateConnectionOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type UpdateConnectionOperation = Operation<
  typeof Key,
  UpdateConnectionInput,
  UpdateConnectionOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type UpdateConnectionInput = {
  /** Current App address. */
  app: PublicKey;

  /** The address of the Connection Initializer. */
  initializer: PublicKey;

  /** The address of the Connection Target. */
  target: PublicKey;

  /** Approve status (Set by Target) */
  approveStatus: boolean
};

/**
 * @group Operations
 * @category Outputs
 */
export type UpdateConnectionOutput = {
  /** The address of the Connection. */
  connectionAddress: PublicKey;

  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const updateConnectionOperationHandler: OperationHandler<UpdateConnectionOperation> =
{
  async handle(
    operation: UpdateConnectionOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<UpdateConnectionOutput> {
    const builder = updateConnectionBuilder(
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
export type UpdateConnectionBuilderParams = Omit<
  UpdateConnectionInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};;

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type UpdateConnectionBuilderContext = Omit<
  UpdateConnectionOutput,
  'response' | 'connection'
>;

/**
 * Updates an Connection.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .connection()
 *   .builders()
 *   .updateConnection({ app, initializer, status })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const updateConnectionBuilder = (
  ju: Ju,
  params: UpdateConnectionBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<UpdateConnectionBuilderContext> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;

  const { 
    app,
    initializer,
    target,
    approveStatus
  } = params;

  // Accounts.
  const authority = ju.identity();

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
    TransactionBuilder.make<UpdateConnectionBuilderContext>()
      .setFeePayer(payer)
      .setContext({
        connectionAddress: connectionPda
      })

      // Update Connection.
      .add({
        instruction: createUpdateConnectionInstruction(
          {
            app,
            initializer,
            target,
            connection: connectionPda,
            user: toPublicKey(authority),
          },
          {
            approveStatus
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'updateConnection',
      })
  );
};