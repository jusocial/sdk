import type { PublicKey } from '@solana/web3.js';
import { toReactionAccount } from '../../accounts';
import { Reaction, toReaction } from '../../models/Reaction';
import {
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';
import { GmaBuilder } from '@/utils';

// -----------------
// Operation
// -----------------

const Key = 'FindAllReactionsByKeyListOperation' as const;

/**
 * Finds all Profiles data for specified pubkey list.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .findAllReactionsByKeyList({ addressList };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAllReactionsByKeyListOperation =
  useOperation<FindAllReactionsByKeyListOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAllReactionsByKeyListOperation = Operation<
  typeof Key,
  FindAllReactionsByKeyListInput,
  FindAllReactionsByKeyListOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAllReactionsByKeyListInput = {
  /** Reactions as Public keys array */
  keys: PublicKey[];

  /** Chunk size */
  chunkSize?: number;
};

/**
 * @group Operations
 * @category Outputs
 */
export type FindAllReactionsByKeyListOutput = (Reaction | null)[];

/**
 * @group Operations
 * @category Handlers
 */
export const findAllReactionsByKeyListOperationHandler: OperationHandler<FindAllReactionsByKeyListOperation> =
{
  handle: async (
    operation: FindAllReactionsByKeyListOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    const { commitment } = scope;
    const { chunkSize } = operation.input;
    // const { loadJsonMetadata = false } = operation.input;

    const { keys } = operation.input;

    const reactionInfos = await GmaBuilder.make(
      ju,
      keys,
      {
        chunkSize,
        commitment,
      }
    ).get();
    scope.throwIfCanceled();

    const reactions: Reaction[] = [];

    for (const account of reactionInfos) {
      if (account.exists) {
        try {
          const reactionAccount = toReactionAccount(account);

          const reaction = toReaction(reactionAccount);

          reactions.push(reaction);

        } catch (error) {
          // TODO
        }
      }
    }

    return reactions;
  },
};