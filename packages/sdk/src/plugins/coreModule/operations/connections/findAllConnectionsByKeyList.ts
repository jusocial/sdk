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

const Key = 'FindAllConnectionsByKeyListOperation' as const;

/**
 * Finds all Connections data for specified pubkey list.
 *
 * ```ts
 * const connection = await ju
 *   .core()
 *   .findAllConnectionsByKeyList({ [] };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAllConnectionsByKeyListOperation =
  useOperation<FindAllConnectionsByKeyListOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAllConnectionsByKeyListOperation = Operation<
  typeof Key,
  FindAllConnectionsByKeyListInput,
  Connection[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAllConnectionsByKeyListInput = {
  /** Connections as Public key array */
  keys: PublicKey[];

  /** Chunk size */
  chunkSize?: number;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindAllConnectionsByKeyListOutput = Connection[];

/**
 * @group Operations
 * @category Handlers
 */
export const findAllConnectionsByKeyListOperationHandler: OperationHandler<FindAllConnectionsByKeyListOperation> =
{
  handle: async (
    operation: FindAllConnectionsByKeyListOperation,
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