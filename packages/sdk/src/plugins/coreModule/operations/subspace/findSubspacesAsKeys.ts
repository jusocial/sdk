import type { PublicKey } from '@solana/web3.js';
import { Subspace, subspaceDiscriminator } from '@ju-protocol/ju-core'
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

const Key = 'FindSubspacesAsKeysOperation' as const;

/**
 * Finds Subspaces by filters (as Public keys Array)
 *
 * ```ts
 * const subspaceKeys = await ju
 *   .core()
 *   .subspaces(app)
 *   .findSubspacesAsKeys();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findSubspacesAsKeysOperation =
  useOperation<FindSubspacesAsKeysOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindSubspacesAsKeysOperation = Operation<
  typeof Key,
  FindSubspacesAsKeysInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindSubspacesAsKeysInput = {
  /** The app address of the Subspace. */
  app?: PublicKey;

  /** The authority of the Subspace. */
  authority?: PublicKey;

  /** The creator of the Subspace. */
  creator?: PublicKey;

  /** Creation year (for additional filtering) */
  creationYear?: number;

  /** Creation month (for additional filtering) */
  creationMonth?: number;

  /** Creation week (for additional filtering) */
  creationWeek?: number;

  /** Creation day (for additional filtering) */
  creationDay?: number;
};

/**
 * @group Operations
 * @category Handlers
 */
export const findSubspacesAsKeysOperationHandler: OperationHandler<FindSubspacesAsKeysOperation> =
{
  handle: async (
    operation: FindSubspacesAsKeysOperation,
    ju: Ju,
    scope: OperationScope
  ) => {

    // const { commitment } = scope;

    const {
      app,
      authority,
      creator,
      creationYear,
      creationMonth,
      creationWeek,
      creationDay,
    } = operation.input;

    const builder = Subspace.gpaBuilder();

    // Add discriminator
    builder.addFilter("accountDiscriminator", subspaceDiscriminator);

    // Add additional filters
    if (app) {
      builder.addFilter("app", app)
    }
    if (authority) {
      builder.addFilter("authority", authority)
    }
    if (creator) {
      builder.addFilter("creator", creator)
    }
    if (creationYear) {
      builder.addFilter("creationYear", creationYear)
    }
    if (creationMonth) {
      builder.addFilter("creationMonth", creationMonth)
    }
    if (creationWeek) {
      builder.addFilter("creationWeek", creationWeek)
    }
    if (creationDay) {
      builder.addFilter("creationDay", creationDay)
    }

    const res = await builder.run(ju.connection);
    scope.throwIfCanceled();

    const keys = res.map((item) => item.pubkey)

    return keys;
  },
};