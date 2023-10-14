import type { PublicKey } from '@solana/web3.js';
import { findConnectionsOperation } from '../connections';
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

const Key = 'FindSubspacesAsKeysByConnectionInitializerOperation' as const;

/**
 * Finds Subspaces by filters (as Public keys Array). 
 *
 * ```ts
 * const subspace = await ju
 *   .core()
 *   .subspaces(app)
 *   .findSubspacesAsKeysByConnectionInitializer({ address };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findSubspacesAsKeysByConnectionInitializerOperation =
  useOperation<FindSubspacesAsKeysByConnectionInitializerOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindSubspacesAsKeysByConnectionInitializerOperation = Operation<
  typeof Key,
  FindSubspacesAsKeysByConnectionInitializerInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindSubspacesAsKeysByConnectionInitializerInput = {
  /** The address of the Application. */
  app: PublicKey;

  /** The address (Subspace Pubkey) of the Connection initializer */
  initializer?: PublicKey;

  /** Approved Subspaces only */
  approved?: boolean;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindSubspacesAsKeysByConnectionInitializerOutput = Subspace[];

/**
 * @group Operations
 * @category Handlers
 */
export const findSubspacesAsKeysByConnectionInitializerOperationHandler: OperationHandler<FindSubspacesAsKeysByConnectionInitializerOperation> =
{
  handle: async (
    operation: FindSubspacesAsKeysByConnectionInitializerOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      app,
      initializer,
      approved
    } = operation.input;

    const connections = await ju
      .operations()
      .execute(findConnectionsOperation({ app, initializer, approved }), scope);
    scope.throwIfCanceled();

    const targets = connections.map((connection) => connection.target);

    return targets;
  },
};