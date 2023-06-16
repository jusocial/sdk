import type { PublicKey } from '@solana/web3.js';
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

const Key = 'FindAllSubspacesByConnectionTargetOperation' as const;

/**
 * Finds all Subspaces for specified Application.
 *
 * ```ts
 * const subspace = await ju
 *   .core()
 *   .findAllSubspacesByConnectionTarget({ });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAllSubspacesByConnectionTargetOperation =
  useOperation<FindAllSubspacesByConnectionTargetOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAllSubspacesByConnectionTargetOperation = Operation<
  typeof Key,
  FindAllSubspacesByConnectionTargetInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAllSubspacesByConnectionTargetInput = {
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
// export type FindAllSubspacesByConnectionTargetOutput = Subspace[];

/**
 * @group Operations
 * @category Handlers
 */
export const findAllSubspacesByConnectionTargetOperationHandler: OperationHandler<FindAllSubspacesByConnectionTargetOperation> =
{
  handle: async (
    operation: FindAllSubspacesByConnectionTargetOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      app,
      target,
      approved
    } = operation.input;

    const connectionAddresses = await ju.core().connection.keysByFilter({ app, target, approved });
    scope.throwIfCanceled();

    const connections = await ju.core().connection.findByKeyList(
      {
        keys: connectionAddresses,
      }
      , scope
    );
    scope.throwIfCanceled();

    const initializers = connections
      .map((connection) => connection.initializer);


    return initializers;
  },
};