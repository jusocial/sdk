import type { PublicKey } from '@solana/web3.js';
import { toPublicationAccount } from '../../accounts';
import { Publication, toPublication } from '../../models/Publication';
import { PublicationJsonMetadata } from '../../models';
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

const Key = 'FindPublicationsByKeyListOperation' as const;

/**
 * Finds all Profiles data for specified pubkey list.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .findPublicationsByKeyList({ addressList };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findPublicationsByKeyListOperation =
  useOperation<FindPublicationsByKeyListOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindPublicationsByKeyListOperation = Operation<
  typeof Key,
  FindPublicationsByKeyListInput,
  FindPublicationsByKeyListOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindPublicationsByKeyListInput = {
  /** Publications as Public keys array */
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
export type FindPublicationsByKeyListOutput = (Publication | null)[];

/**
 * @group Operations
 * @category Handlers
 */
export const findPublicationsByKeyListOperationHandler: OperationHandler<FindPublicationsByKeyListOperation> =
{
  handle: async (
    operation: FindPublicationsByKeyListOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    const { commitment } = scope;
    const {
      chunkSize,
      loadJsonMetadata = false
    } = operation.input;

    const { keys } = operation.input;

    const publicationInfos = await GmaBuilder.make(
      ju,
      keys,
      {
        chunkSize,
        commitment,
      }
    ).get();
    scope.throwIfCanceled();

    const publications: Publication[] = [];

    for (const account of publicationInfos) {
      if (account.exists) {
        try {
          const publicationAccount = toPublicationAccount(account);

          // TO-DO: Catching metadata here might be slow, need to find the way...
          const { metadataUri } = publicationAccount.data;
          let metadataJson: Option<PublicationJsonMetadata<string>> | undefined = undefined

          if (loadJsonMetadata && metadataUri) {
            try {
              metadataJson = await ju
                .storage()
                .downloadJson<PublicationJsonMetadata>(metadataUri, scope);
            } catch (error) {
              // TODO
            }
          }

          const profile = toPublication(
            publicationAccount,
            metadataJson
          );

          publications.push(profile);

        } catch (error) {
          // TODO
        }
      }
    }

    return publications;
  },
};