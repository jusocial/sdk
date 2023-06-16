import { createDeleteConnectionInstruction } from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { Ju } from '@/Ju';
import {
  Operation,
  OperationHandler,
  OperationScope,
  PublicKey,
  // Signer,
  toPublicKey,
  useOperation,
} from '@/types';
import { TransactionBuilder, TransactionBuilderOptions } from '@/utils';

// -----------------
// Operation
// -----------------

const Key = 'DeleteConnectionOperation' as const;

/**
 * Deletes an existing Connection.
 *
 * ```ts
 * await ju
 *   .core()
 *   .deleteConnection(
 *      { 
 *        app:, 
 *        target: 
 *      }
 *    );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const deleteConnectionOperation = useOperation<DeleteConnectionOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type DeleteConnectionOperation = Operation<
  typeof Key,
  DeleteConnectionInput,
  DeleteConnectionOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type DeleteConnectionInput = {
  /** App current App address. */
  app: PublicKey;

  /** The Target of the Connection. */
  target: PublicKey;
};

/**
 * @group Operations
 * @category Outputs
 */
export type DeleteConnectionOutput = {
  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const deleteConnectionOperationHandler: OperationHandler<DeleteConnectionOperation> = {
  handle: async (
    operation: DeleteConnectionOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<DeleteConnectionOutput> => {
    return deleteConnectionBuilder(ju, operation.input, scope).sendAndConfirm(
      ju,
      scope.confirmOptions
    );
  },
};

// -----------------
// Builder
// -----------------

/**
 * @group Transaction Builders
 * @category Inputs
 */
export type DeleteConnectionBuilderParams = Omit<DeleteConnectionInput, 'confirmOptions'> & {
  /** A key to distinguish the instruction that burns the Connection. */
  instructionKey?: string;
};

/**
 * Deletes an existing Connection.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .core()
 *   .builders()
 *   .deleteConnection(
 *      { 
 *        app:, 
 *        target: 
 *      }
 *    );
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const deleteConnectionBuilder = (
  ju: Ju,
  params: DeleteConnectionBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder => {
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;
  const { app, target } = params;

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

  return TransactionBuilder.make()
    .add({
      instruction: createDeleteConnectionInstruction(
        {
          app,
          initializerProfile: initializer,
          target,
          connection: connectionPda,
          authority: toPublicKey(authority),
        }
      ),
      signers: [payer],
      key: params.instructionKey ?? 'deleteConnection',
    });
};
