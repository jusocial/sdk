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

const Key = 'FindProfilesAsKeysByConnectionTargetOperation' as const;

/**
 * Finds all Profiles for specified Application.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .profiles(app)
 *   .findProfilesAsKeysByConnectionTargetByApp(
 *      {
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
export const findProfilesAsKeysByConnectionTargetOperation =
  useOperation<FindProfilesAsKeysByConnectionTargetOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindProfilesAsKeysByConnectionTargetOperation = Operation<
  typeof Key,
  FindProfilesAsKeysByConnectionTargetInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindProfilesAsKeysByConnectionTargetInput = {
  /** The address of the Application. */
  app?: PublicKey;

  /** The address (Profile Pubkey) of the Connection target */
  target: PublicKey;

  /** Approved Profiles only */
  isApproved?: boolean;

  /** Is event happens in 7-day-period  (for additional filtering) */
  isIn7Days?: boolean;

  /** Is event happens in 3-day-period  (for additional filtering) */
  isIn3Days?: boolean;

  /** Is event happens today  (for additional filtering) */
  isToday?: boolean;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindProfilesAsKeysByConnectionTargetOutput = Profile[];

/**
 * @group Operations
 * @category Handlers
 */
export const findProfilesAsKeysByConnectionTargetOperationHandler: OperationHandler<FindProfilesAsKeysByConnectionTargetOperation> =
{
  handle: async (
    operation: FindProfilesAsKeysByConnectionTargetOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      app,
      target,
      isApproved,
      isIn7Days,
      isIn3Days,
      isToday
    } = operation.input;

    const connections = await ju
      .operations()
      .execute(findConnectionsOperation({ app, target, isApproved, isIn7Days ,isIn3Days, isToday }), scope);
    scope.throwIfCanceled();

    const initializers = connections.map((connection) => connection.initializer);

    return initializers;
  },
};