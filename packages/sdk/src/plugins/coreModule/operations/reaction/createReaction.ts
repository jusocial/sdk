import {
  ReactionType,
  createCreateReactionInstruction,
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

const Key = 'CreateReactionOperation' as const;

/**
 * Creates an Reactionlication.
 *
 * ```ts
 * await ju
 *   .core()
 *   .createReaction({ app, target });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const createReactionOperation =
  useOperation<CreateReactionOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type CreateReactionOperation = Operation<
  typeof Key,
  CreateReactionInput,
  CreateReactionOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type CreateReactionInput = {
  /** Current App address. */
  app: PublicKey;

  /** Reaction Target */
  target: PublicKey;

  /** Reaction Type */
  reactionType: ReactionType;  
};

/**
 * @group Operations
 * @category Outputs
 */
export type CreateReactionOutput = {
  /** The address of the Reaction. */
  reactionAddress: PublicKey;

  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const createReactionOperationHandler: OperationHandler<CreateReactionOperation> =
{
  async handle(
    operation: CreateReactionOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<CreateReactionOutput> {
    const builder = createReactionBuilder(
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
export type CreateReactionBuilderParams = Omit<
  CreateReactionInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};;

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type CreateReactionBuilderContext = Omit<
  CreateReactionOutput,
  'response' | 'reaction'
>;

/**
 * Creates an Reaction.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .reaction()
 *   .builders()
 *   .createReaction({ app, target, reactionType })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const createReactionBuilder = (
  ju: Ju,
  params: CreateReactionBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<CreateReactionBuilderContext> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;
  const { app, target, reactionType } = params;

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

  return (
    TransactionBuilder.make<CreateReactionBuilderContext>()
      .setFeePayer(payer)
      .setContext({
        reactionAddress: reactionPda,
      })

      // Create and initialize the Reaction account.
      .add({
        instruction: createCreateReactionInstruction(
          {
            app,
            reaction: reactionPda,
            initializer,
            target,
            authority: toPublicKey(authority),
          },
          {
            reactionType
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'createReaction',
      })
  );
};