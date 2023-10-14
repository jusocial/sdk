import type { PublicKey } from '@solana/web3.js';
import { Reaction, reactionDiscriminator , ReactionType } from '@ju-protocol/ju-core'
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
  app: PublicKey;

  /** Reaction initializer address (for additional filtering) */
  initializer?: PublicKey;

  /** Reaction target address (for additional filtering) */
  target?: PublicKey;

  /** Reaction type 
   * Profile = 0,
   * Subspace = 1
  */
  reactionType?: ReactionType;
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
      reactionType
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

    // Limit returned accouns data to minimum
    builder.config.dataSlice = {offset: 0, length: 0};

    const res = await builder.run(ju.connection);

    scope.throwIfCanceled();

    const reactionAddresses = res.map((item) => item.pubkey)

    return reactionAddresses;
  },
};