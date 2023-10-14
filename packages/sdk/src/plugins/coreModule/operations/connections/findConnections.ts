import type { PublicKey } from '@solana/web3.js';
import { Connection as ConnectionCore, connectionDiscriminator, ConnectionTargetType } from '@ju-protocol/ju-core';
import { toConnectionAccount } from '../../accounts';
import { Connection, toConnection } from '../../models';
import {
  lamports,
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';

// -----------------
// Operation
// -----------------

const Key = 'FindConnectionsOperation' as const;

/**
 * Finds all Connections for Applications.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .connections(app)
 *   .findConnections({ app: PublicKey };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findConnectionsOperation =
  useOperation<FindConnectionsOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindConnectionsOperation = Operation<
  typeof Key,
  FindConnectionsInput,
  FindConnectionsOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindConnectionsInput = {
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
export type FindConnectionsOutput = Connection[];

/**
 * @group Operations
 * @category Handlers
 */
export const findConnectionsOperationHandler: OperationHandler<FindConnectionsOperation> = {
  handle: async (
    operation: FindConnectionsOperation,
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

    const builder = ConnectionCore.gpaBuilder();
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

    const res = await builder.run(ju.connection);
    scope.throwIfCanceled();

    const unparsedAccounts = res.map(({ pubkey, account }) => (
      {
        ...account,
        publicKey: pubkey,
        lamports: lamports(account.lamports),
      }
    ));

    const connections: Connection[] = [];

    for (const account of unparsedAccounts) {
      try {
        const connectionAccount = toConnectionAccount(account);

        const connection = toConnection(connectionAccount);

        connections.push(connection);

      } catch (error) {
        // TODO
      }
    }

    return connections;

  }
};