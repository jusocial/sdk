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

const Key = 'FindAllSubspacesOperation' as const;

/**
 * Finds all Subspaces for specified Application.
 *
 * ```ts
 * const subspaceKeys = await ju
 *   .core()
 *   .findAllSubspaces({ app:  };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAllSubspacesOperation =
  useOperation<FindAllSubspacesOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAllSubspacesOperation = Operation<
  typeof Key,
  FindAllSubspacesInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAllSubspacesInput = {
  /** The address of the Application. */
  app: PublicKey;
};

/**
 * @group Operations
 * @category Handlers
 */
export const findAllSubspacesOperationHandler: OperationHandler<FindAllSubspacesOperation> =
{
  handle: async (
    operation: FindAllSubspacesOperation,
    ju: Ju,
    scope: OperationScope
  ) => {

    // const { commitment } = scope;

    const { 
      app
    } = operation.input;

    const builder = Subspace.gpaBuilder();

    // Add discriminator
    builder.addFilter("accountDiscriminator", subspaceDiscriminator);
    
    // Add additional filters

    
    builder.addFilter("app", app)
    
    const res = await builder.run(ju.connection);
    scope.throwIfCanceled();
    
    const subspaceAddresses = res.map((item) => item.pubkey)

    return subspaceAddresses;
  },
};