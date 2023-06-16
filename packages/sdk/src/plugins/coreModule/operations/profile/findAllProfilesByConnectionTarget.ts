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

const Key = 'FindAllProfilesByConnectionTargetOperation' as const;

/**
 * Finds all Profiles for specified Application.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .findAllProfilesByConnectionTargetByApp(
 *      {
 *        app: JP8sM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUQgT,
 *        target: asdsM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUdfg,
 *        approved: false,
 *        loadJsonMetadata: true,
 *        limit: 10
 *      }
 *   );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAllProfilesByConnectionTargetOperation =
  useOperation<FindAllProfilesByConnectionTargetOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAllProfilesByConnectionTargetOperation = Operation<
  typeof Key,
  FindAllProfilesByConnectionTargetInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAllProfilesByConnectionTargetInput = {
  /** The address of the Application. */
  app: PublicKey;

  /** The address (Profile Pubkey) of the Connection target */
  target: PublicKey;

  /** Approved Profiles only */
  approved?: boolean;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindAllProfilesByConnectionTargetOutput = Profile[];

/**
 * @group Operations
 * @category Handlers
 */
export const findAllProfilesByConnectionTargetOperationHandler: OperationHandler<FindAllProfilesByConnectionTargetOperation> =
{
  handle: async (
    operation: FindAllProfilesByConnectionTargetOperation,
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
      , scope);
    scope.throwIfCanceled();

    const initializers = connections.map((connection) => connection.initializer);

    return initializers;
  },
};