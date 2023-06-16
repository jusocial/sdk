import { createDeleteReactionInstruction } from '@ju-protocol/ju-core';
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

const Key = 'DeleteReactionOperation' as const;

/**
 * Deletes an existing Reaction.
 *
 * ```ts
 * await ju
 *   .core()
 *   .deleteReaction({ app, target });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const deleteReactionOperation = useOperation<DeleteReactionOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type DeleteReactionOperation = Operation<
  typeof Key,
  DeleteReactionInput,
  DeleteReactionOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type DeleteReactionInput = {
  /** App current App address. */
  app: PublicKey;

  /** The Target of the Reaction. */
  target: PublicKey;
};

/**
 * @group Operations
 * @category Outputs
 */
export type DeleteReactionOutput = {
  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const deleteReactionOperationHandler: OperationHandler<DeleteReactionOperation> = {
  handle: async (
    operation: DeleteReactionOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<DeleteReactionOutput> => {
    return deleteReactionBuilder(ju, operation.input, scope).sendAndConfirm(
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
export type DeleteReactionBuilderParams = Omit<DeleteReactionInput, 'confirmOptions'> & {
  /** A key to distinguish the instruction that burns the Reaction. */
  instructionKey?: string;
};

/**
 * Deletes an existing Reaction.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .core()
 *   .builders()
 *   .deleteReaction({ app, target });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const deleteReactionBuilder = (
  ju: Ju,
  params: DeleteReactionBuilderParams,
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

  const reactionPda = ju
    .core()
    .pdas()
    .reaction({
      app,
      initializer,
      target,
      programs,
    });

  return TransactionBuilder.make()
    .add({
      instruction: createDeleteReactionInstruction(
        {
          app,
          initializer,
          target,
          reaction: reactionPda,
          authority: toPublicKey(authority),
        }
      ),
      signers: [payer],
      key: params.instructionKey ?? 'deleteReaction',
    });
};
