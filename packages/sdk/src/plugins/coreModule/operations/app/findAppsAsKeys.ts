import type { PublicKey } from '@solana/web3.js';
import { App, appDiscriminator } from '@ju-protocol/ju-core';
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

const Key = 'FindAppsAsKeysOperation' as const;

/**
 * Finds all Protocol Applications as Public key array.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .apps()
 *   .findAppsAsKeys({ authority?: PublicKey });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAppsAsKeysOperation =
  useOperation<FindAppsAsKeysOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAppsAsKeysOperation = Operation<
  typeof Key,
  FindAppsAsKeysInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAppsAsKeysInput = {
  /** The authority of the Application. */
  authority?: PublicKey;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindAppsAsKeysOutput = PublicKey[];

/**
 * @group Operations
 * @category Handlers
 */
export const findAppsAsKeysOperationHandler: OperationHandler<FindAppsAsKeysOperation> =
{
  handle: async (
    operation: FindAppsAsKeysOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const { 
      authority
    } = operation.input;

    const builder =  App.gpaBuilder();
    // Add discriminator
    builder.addFilter("accountDiscriminator", appDiscriminator);
    
    // Add additional filters

    if (authority) {
      builder.addFilter("authority", authority);
    }

    // Limit returned accouns data to minimum
    builder.config.dataSlice = {offset: 0, length: 0};

    const res = await builder.run(ju.connection);

    scope.throwIfCanceled();

    const keys = res.map((item) => item.pubkey)

    return keys;
  },
};