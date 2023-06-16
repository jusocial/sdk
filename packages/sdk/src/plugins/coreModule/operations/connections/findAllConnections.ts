import { Connection, connectionDiscriminator, ConnectionTargetType } from '@ju-protocol/ju-core'
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

const Key = 'FindAllConnectionsOperation' as const;

/**
 * Finds all Profiles for specified Application.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .findAllConnectionsByApp({ address };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAllConnectionsOperation =
  useOperation<FindAllConnectionsOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAllConnectionsOperation = Operation<
  typeof Key,
  FindAllConnectionsInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAllConnectionsInput = {
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
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindAllConnectionsOutput = Connection[];

/**
 * @group Operations
 * @category Handlers
 */
export const findAllConnectionsOperationHandler: OperationHandler<FindAllConnectionsOperation> =
{
  handle: async (
    operation: FindAllConnectionsOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const { 
      app,
      initializer,
      target,
      connectionTargetType,
      approved
    } = operation.input;

    const builder =  Connection.gpaBuilder();
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
    if (approved) {
      builder.addFilter("approved", approved)
    }

    // Limit returned accouns data to minimum
    builder.config.dataSlice = {offset: 0, length: 0};

    const res = await builder.run(ju.connection);
    
    const connectionAddresses = res.map((connection) => connection.pubkey)

    return connectionAddresses;
  },
};