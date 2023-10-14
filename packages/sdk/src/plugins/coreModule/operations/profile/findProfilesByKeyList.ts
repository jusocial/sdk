import type { PublicKey } from '@solana/web3.js';
import { toProfileAccount } from '../../accounts';
import { Profile, toProfile } from '../../models/Profile';
import { ProfileJsonMetadata } from '../../models';
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

const Key = 'FindProfilesByKeyListOperation' as const;

/**
 * Finds all Profiles data for specified pubkey list.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .findProfilesByKeyList({ [] };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findProfilesByKeyListOperation =
  useOperation<FindProfilesByKeyListOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindProfilesByKeyListOperation = Operation<
  typeof Key,
  FindProfilesByKeyListInput,
  FindProfilesByKeyListOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindProfilesByKeyListInput = {
  /** Profiles as Public key array */
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
export type FindProfilesByKeyListOutput = Profile[];

/**
 * @group Operations
 * @category Handlers
 */
export const findProfilesByKeyListOperationHandler: OperationHandler<FindProfilesByKeyListOperation> =
{
  handle: async (
    operation: FindProfilesByKeyListOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    const { commitment } = scope;

    const { 
      keys,
      loadJsonMetadata = true,
      chunkSize
    } = operation.input;

    const profileInfos = await GmaBuilder.make(
      ju,
      keys,
      {
        chunkSize,
        commitment,
      }
    ).get();
    scope.throwIfCanceled();

    const profiles: Profile[] = [];

    for (const account of profileInfos) {
      if (account.exists) {
        try {
          const profileAccount = toProfileAccount(account);

          // TO-DO: Catching metadata here might be slow, need to find the way...
          const { metadataUri } = profileAccount.data;
          let metadataJson: Option<ProfileJsonMetadata<string>> | undefined = undefined

          if (loadJsonMetadata && metadataUri) {
            try {
              metadataJson = await ju
                .storage()
                .downloadJson<ProfileJsonMetadata>(metadataUri, scope);
            } catch (error) {
              // TODO
            }
          }

          const profile = toProfile(
            profileAccount,
            metadataJson
          );

          profiles.push(profile);

        } catch (error) {
          // TODO
        }
      }
    }

    return profiles;
  },
};