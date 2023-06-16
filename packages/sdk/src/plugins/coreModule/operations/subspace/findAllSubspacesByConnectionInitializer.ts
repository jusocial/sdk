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

const Key = 'FindAllSubspacesByConnectionInitializerOperation' as const;

/**
 * Finds all Subspaces for specified Application. 
 *
 * ```ts
 * const subspace = await ju
 *   .core()
 *   .findAllSubspacesByConnectionInitializer({ address };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAllSubspacesByConnectionInitializerOperation =
  useOperation<FindAllSubspacesByConnectionInitializerOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAllSubspacesByConnectionInitializerOperation = Operation<
  typeof Key,
  FindAllSubspacesByConnectionInitializerInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAllSubspacesByConnectionInitializerInput = {
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
// export type FindAllSubspacesByConnectionInitializerOutput = Subspace[];

/**
 * @group Operations
 * @category Handlers
 */
export const findAllSubspacesByConnectionInitializerOperationHandler: OperationHandler<FindAllSubspacesByConnectionInitializerOperation> =
{
  handle: async (
    operation: FindAllSubspacesByConnectionInitializerOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      app,
      initializer,
      approved
    } = operation.input;

    const connectionAddresses = await ju.core().connection.keysByFilter({ app, initializer, approved });
    scope.throwIfCanceled();

    const connections = await ju.core().connection.findByKeyList(
      {
        keys: connectionAddresses,
      }
      , scope
    );
    scope.throwIfCanceled();

    const targets = connections.map((connection) => connection.target);

    // const subspaces = await ju.core().findAllSubspacesByKeyList(
    //   {
    //     keys: targets,
    //     loadJsonMetadata   // Better false here?
    //   }
    //   , scope);
    // scope.throwIfCanceled();

    return targets;
  },
};