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

const Key = 'FindSubspacesAsKeysByConnectionTargetOperation' as const;

/**
 * Finds Subspaces by filters (as Public keys Array).
 *
 * ```ts
 * const subspace = await ju
 *   .core()
 *   .subspaces(app)
 *   .findSubspacesAsKeysByConnectionTarget();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findSubspacesAsKeysByConnectionTargetOperation =
  useOperation<FindSubspacesAsKeysByConnectionTargetOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindSubspacesAsKeysByConnectionTargetOperation = Operation<
  typeof Key,
  FindSubspacesAsKeysByConnectionTargetInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindSubspacesAsKeysByConnectionTargetInput = {
  /** The address of the Application. */
  app: PublicKey;

  /** The address (Subspace Pubkey) of the Connection target */
  target: PublicKey;

  /** Approved Subspaces only */
  approved?: boolean;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindSubspacesAsKeysByConnectionTargetOutput = Subspace[];

/**
 * @group Operations
 * @category Handlers
 */
export const findSubspacesAsKeysByConnectionTargetOperationHandler: OperationHandler<FindSubspacesAsKeysByConnectionTargetOperation> =
{
  handle: async (
    operation: FindSubspacesAsKeysByConnectionTargetOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      app,
      target,
      approved
    } = operation.input;

    const connections = await ju
      .operations()
      .execute(findConnectionsOperation({ app, target, approved }), scope);
    scope.throwIfCanceled();

    const initializers = connections
      .map((connection) => connection.initializer);


    return initializers;
  },
};