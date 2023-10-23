import type { PublicKey } from '@solana/web3.js';
import { Reaction, reactionDiscriminator , ReactionType } from '@ju-protocol/ju-core'
import { todayToSearchInterval } from '../../helpers';
import {
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';

// -----------------
// Operation
// -----------------

const Key = 'FindReactionsAsKeysOperation' as const;

/**
 * Finds all Reactions by specified filters (as Public keys Array).
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .reactions(app)
 *   .findReactionsAsKeys({ });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findReactionsAsKeysOperation =
  useOperation<FindReactionsAsKeysOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindReactionsAsKeysOperation = Operation<
  typeof Key,
  FindReactionsAsKeysInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindReactionsAsKeysInput = {
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
export const findReactionsAsKeysOperationHandler: OperationHandler<FindReactionsAsKeysOperation> =
{
  handle: async (
    operation: FindReactionsAsKeysOperation,
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


    const builder =  Reaction.gpaBuilder();
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

    // Limit returned accouns data to minimum
    builder.config.dataSlice = {offset: 0, length: 0};

    const res = await builder.run(ju.connection);

    scope.throwIfCanceled();

    const reactionAddresses = res.map((item) => item.pubkey)

    return reactionAddresses;
  },
};