import type { PublicKey } from '@solana/web3.js';
import { toAppAccount } from '../../accounts';
import { App, toApp } from '../../models/App';
import { AppJsonMetadata } from '../../models';
import {
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';
import { Option, GmaBuilder } from '@/utils';

// -----------------
// Operation
// -----------------

const Key = 'FindAppsByKeyListOperation' as const;

/**
 * Finds all Apps data for specified Pubkey list.
 *
 * ```ts
 * const app = await ju
 *   .core()
 *   .apps()
 *   .findAppsByKeyList({ [] };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAppsByKeyListOperation =
  useOperation<FindAppsByKeyListOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAppsByKeyListOperation = Operation<
  typeof Key,
  FindAppsByKeyListInput,
  App[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAppsByKeyListInput = {
  /** Apps as Public key array */
  keys: PublicKey[];

  /**
   * Whether or not we should fetch the JSON Metadata.
   *
   * @defaultValue `true`
   */
  loadJsonMetadata?: boolean;

  /** Chunk size */
  chunkSize?: number;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindAppsByKeyListOutput = App[];

/**
 * @group Operations
 * @category Handlers
 */
export const findAppsByKeyListOperationHandler: OperationHandler<FindAppsByKeyListOperation> =
{
  handle: async (
    operation: FindAppsByKeyListOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    const { commitment } = scope;
    const { chunkSize } = operation.input;
    // const { loadJsonMetadata = false } = operation.input;

    const {
      keys,
      loadJsonMetadata = true
    } = operation.input;

    const appInfos = await GmaBuilder.make(
      ju,
      keys,
      {
        chunkSize,
        commitment,
      }
    ).get();
    scope.throwIfCanceled();

    const apps: App[] = [];

    for (const account of appInfos) {
      if (account.exists) {
        try {
          const appAccount = toAppAccount(account);

          // TO-DO: Catching metadata here might be slow, need to find the way...
          const { metadataUri } = appAccount.data;
          let metadataJson: Option<AppJsonMetadata<string>> | undefined = undefined

          if (loadJsonMetadata && metadataUri) {
            try {
              metadataJson = await ju
                .storage()
                .downloadJson<AppJsonMetadata>(metadataUri, scope);
            } catch (error) {
              // TODO
            }
          }

          const app = toApp(
            appAccount,
            metadataJson
          );

          apps.push(app);

        } catch (error) {
          // TODO
        }
      }
    }

    return apps;
  },
};