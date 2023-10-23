import type { PublicKey } from '@solana/web3.js';
import { Reaction as ReactionCore, reactionDiscriminator , ReactionType } from '@ju-protocol/ju-core'
import { Reaction, toReaction } from '../../models';
import { toReactionAccount } from '../../accounts';
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

const Key = 'FindReactionsOperation' as const;

/**
 * Finds all Reactions by specified filters.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .reactions(app)
 *   .findReactions({ });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findReactionsOperation =
  useOperation<FindReactionsOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindReactionsOperation = Operation<
  typeof Key,
  FindReactionsInput,
  Reaction[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindReactionsInput = {
  /** The address of the Application. */
  app?: PublicKey;

  /** Reaction initializer address (for additional filtering) */
  initializer?: PublicKey;

  /** Reaction target address (for additional filtering) */
  target?: PublicKey;

  /** Reaction type 
   * { __kind: "UpVote" }
   * { __kind: "UpVote" }
   * { __kind: "CustomVote", code: 123 }
  */
  reactionType?: ReactionType;

  /** Is event happens in 7-day-period  (for additional filtering) */
  isIn7Days?: boolean;

  /** Is event happens in 3-day-period  (for additional filtering) */
  isIn3Days?: boolean;

  /** Is event happens today  (for additional filtering) */
  isToday?: boolean;

};

// /**
//  * @group Operations
//  * @category Outputs
//  */
// export type FindReactionsOutput = Reaction[];

/**
 * @group Operations
 * @category Handlers
 */
export const findReactionsOperationHandler: OperationHandler<FindReactionsOperation> =
{
  handle: async (
    operation: FindReactionsOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const { 
      app,
      initializer,
      target,
      reactionType,
      isIn7Days,
      isIn3Days,
      isToday
     } = operation.input;


    const builder =  ReactionCore.gpaBuilder();
    // Add discriminator
    builder.addFilter("accountDiscriminator", reactionDiscriminator);
    
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
    if (reactionType) {
      builder.addFilter("reactionType", reactionType);
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

    const reactions: Reaction[] = [];

    for (const account of unparsedAccounts) {
      try {
        const connectionAccount = toReactionAccount(account);

        const reaction = toReaction(connectionAccount);

        reactions.push(reaction);

      } catch (error) {
        // TODO
      }
    }

    return reactions;
    
  },
};