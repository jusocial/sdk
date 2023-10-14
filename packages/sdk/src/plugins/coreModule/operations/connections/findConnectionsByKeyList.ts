import type { PublicKey } from '@solana/web3.js';
import { toConnectionAccount } from '../../accounts';
import { Connection, toConnection } from '../../models/Connection';
import {
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';
import { GmaBuilder } from '@/utils';

// -----------------
// Operation
// -----------------

const Key = 'FindConnectionsByKeyListOperation' as const;

/**
 * Finds all Connections data for specified pubkey list.
 *
 * ```ts
 * const connection = await ju
 *   .core()
 *   .connections(app)
 *   .findConnectionsByKeyList({ [] };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findConnectionsByKeyListOperation =
  useOperation<FindConnectionsByKeyListOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindConnectionsByKeyListOperation = Operation<
  typeof Key,
  FindConnectionsByKeyListInput,
  Connection[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindConnectionsByKeyListInput = {
  /** Connections as Public key array */
  keys: PublicKey[];

  /** Chunk size */
  chunkSize?: number;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindConnectionsByKeyListOutput = Connection[];

/**
 * @group Operations
 * @category Handlers
 */
export const findConnectionsByKeyListOperationHandler: OperationHandler<FindConnectionsByKeyListOperation> =
{
  handle: async (
    operation: FindConnectionsByKeyListOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    const { commitment } = scope;
    const { chunkSize } = operation.input;
    // const { loadJsonMetadata = false } = operation.input;

    const { keys } = operation.input;

    const connectionInfos = await GmaBuilder.make(
      ju,
      keys,
      {
        chunkSize,
        commitment,
      }
    ).get();
    scope.throwIfCanceled();

    const connections: Connection[] = [];

    for (const account of connectionInfos) {
      if (account.exists) {
        try {
          const connectionAccount = toConnectionAccount(account);

          const connection = toConnection(connectionAccount);

          connections.push(connection);

        } catch (error) {
          // TODO
        }
      }
    }

    return connections;
  },
};