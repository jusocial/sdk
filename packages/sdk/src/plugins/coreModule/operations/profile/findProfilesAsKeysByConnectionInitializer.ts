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

const Key = 'FindProfilesAsKeysByConnectionInitializerOperation' as const;

/**
 * Finds all Profiles for specified Application. 
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .profile(app)
 *   .findProfilesAsKeysByConnectionInitializer(
 *      {
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
export const findProfilesAsKeysByConnectionInitializerOperation =
  useOperation<FindProfilesAsKeysByConnectionInitializerOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindProfilesAsKeysByConnectionInitializerOperation = Operation<
  typeof Key,
  FindProfilesAsKeysByConnectionInitializerInput,
  FindProfilesAsKeysByConnectionInitializerOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindProfilesAsKeysByConnectionInitializerInput = {
  /** The address of the Application. */
  app?: PublicKey;

  /** The address (Profile Pubkey) of the Connection initializer */
  initializer?: PublicKey;

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
export type FindProfilesAsKeysByConnectionInitializerOutput = PublicKey[];

/**
 * @group Operations
 * @category Handlers
 */
export const findProfilesAsKeysByConnectionInitializerOperationHandler: OperationHandler<FindProfilesAsKeysByConnectionInitializerOperation> =
{
  handle: async (
    operation: FindProfilesAsKeysByConnectionInitializerOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      app,
      initializer,
      isApproved,
      isIn7Days,
      isIn3Days,
      isToday
    } = operation.input;

    const connections = await ju
      .operations()
      .execute(findConnectionsOperation({ app, initializer, isApproved, isIn7Days ,isIn3Days, isToday }), scope);
    scope.throwIfCanceled();


    const targets = connections.map((connection) => connection.target);

    return targets;
  },
};