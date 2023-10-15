import { Connection, connectionDiscriminator, ConnectionTargetType } from '@ju-protocol/ju-core'
import type { PublicKey } from '@solana/web3.js';
import { todayToSearchInterval } from '../../helpers';
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

const Key = 'FindConnectionsAsKeysOperation' as const;

/**
 * Finds all Connections for specified Application.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .connections(app)
 *   .findConnectionsAsKeys({ address });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findConnectionsAsKeysOperation =
  useOperation<FindConnectionsAsKeysOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindConnectionsAsKeysOperation = Operation<
  typeof Key,
  FindConnectionsAsKeysInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindConnectionsAsKeysInput = {
  /** The address of the Application. */
  app: PublicKey;

  /** Connection initializer address (for additional filtering) */
  initializer?: PublicKey;

  /** Connection target address (for additional filtering) */
  target?: PublicKey;

  /** Connection target type 
   * Profile = 0,
   * Subspace = 1
  */
  connectionTargetType?: ConnectionTargetType;

  /** Connection status (for additional filtering) */
  approved?: boolean;

  /** Is event happens in 3-day-period  (for additional filtering) */
  isIn3Days?: boolean;

  /** Is event happens today  (for additional filtering) */
  isToday?: boolean;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindConnectionsOutput = Connection[];

/**
 * @group Operations
 * @category Handlers
 */
export const findConnectionsAsKeysOperationHandler: OperationHandler<FindConnectionsAsKeysOperation> =
{
  handle: async (
    operation: FindConnectionsAsKeysOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      app,
      initializer,
      target,
      connectionTargetType,
      approved,
      isIn3Days,
      isToday
    } = operation.input;

    const builder = Connection.gpaBuilder();
    // Add discriminator
    builder.addFilter("accountDiscriminator", connectionDiscriminator);

    // Add additional filters

    if (app) {
      builder.addFilter("app", app)
    }
    if (initializer) {
      builder.addFilter("initializer", initializer)
    }
    if (target) {
      builder.addFilter("target", target)
    }
    if (connectionTargetType) {
      builder.addFilter("connectionTargetType", connectionTargetType)
    }
    if (approved !== undefined) {
      builder.addFilter("approved", approved)
    }
    if (isIn3Days) {
      builder.addFilter("searchable3Day", todayToSearchInterval(3))
    }
    if (isToday) {
      builder.addFilter("searchableDay", todayToSearchInterval(1))
    }

    // Limit returned accouns data to minimum
    builder.config.dataSlice = { offset: 0, length: 0 };

    const res = await builder.run(ju.connection);

    const connectionAddresses = res.map((connection) => connection.pubkey)

    return connectionAddresses;
  },
};