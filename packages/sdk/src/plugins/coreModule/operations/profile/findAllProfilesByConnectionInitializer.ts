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

const Key = 'FindAllProfilesByConnectionInitializerOperation' as const;

/**
 * Finds all Profiles for specified Application. 
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .findAllProfilesByConnectionInitializerByApp(
 *      {
 *        app: JP8sM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUQgT,
 *        initializer: asdsM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUdfg,
 *        approved: false,
 *        loadJsonMetadata: true,
 *        limit: 30
 *      }
 *   );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAllProfilesByConnectionInitializerOperation =
  useOperation<FindAllProfilesByConnectionInitializerOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAllProfilesByConnectionInitializerOperation = Operation<
  typeof Key,
  FindAllProfilesByConnectionInitializerInput,
  FindAllProfilesByConnectionInitializerOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAllProfilesByConnectionInitializerInput = {
  /** The address of the Application. */
  app: PublicKey;

  /** The address (Profile Pubkey) of the Connection initializer */
  initializer?: PublicKey;

  /** Approved Profiles only */
  approved?: boolean;
};

/**
 * @group Operations
 * @category Outputs
 */
export type FindAllProfilesByConnectionInitializerOutput = PublicKey[];

/**
 * @group Operations
 * @category Handlers
 */
export const findAllProfilesByConnectionInitializerOperationHandler: OperationHandler<FindAllProfilesByConnectionInitializerOperation> =
{
  handle: async (
    operation: FindAllProfilesByConnectionInitializerOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      app,
      initializer,
      approved,
    } = operation.input;

    const connectionAddresses = await ju.core().connection.keysByFilter({ app, initializer, approved });
    scope.throwIfCanceled();

    const connections = await ju.core().connection.findByKeyList(
      {
        keys: connectionAddresses,
      }
      , scope);
    scope.throwIfCanceled();

    const targets = connections.map((connection) => connection.target);

    return targets;
  },
};