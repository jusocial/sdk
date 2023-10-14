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

// -----------------
// Operation
// -----------------

const Key = 'FindProfileByAddressOperation' as const;

/**
 * Finds an Profile by its address.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .profiles(app)
 *   .findByAddress(
 *      { 
 *        profile: JP8sM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUQgT,
 *        loadJsonMetadata: true
 *      }
 *    );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findProfileByAddressOperation =
  useOperation<FindProfileByAddressOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindProfileByAddressOperation = Operation<
  typeof Key,
  FindProfileByAddressInput,
  Profile
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindProfileByAddressInput = {
  /** The address of the Profile. */
  profile: PublicKey;

  /**
   * Whether or not we should fetch the JSON Metadata.
   *
   * @defaultValue `true`
   */
  loadJsonMetadata?: boolean;
};

/**
 * @group Operations
 * @category Handlers
 */
export const findProfileByAddressOperationHandler: OperationHandler<FindProfileByAddressOperation> =
{
  handle: async (
    operation: FindProfileByAddressOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    const { commitment } = scope;
    const { 
      profile,
      loadJsonMetadata = true
    } = operation.input;

    const account = await ju
      .rpc()
      .getAccount(profile, commitment);
    scope.throwIfCanceled();

    if (!account.exists) {
      // TO-DO
      throw Error('Profile not found');
    }

    const profileAccount = toProfileAccount(account);

    let metadataJson: ProfileJsonMetadata<string> = {}
    if (loadJsonMetadata && profileAccount.data.metadataUri) {
      try {
        metadataJson = await ju
          .storage()
          .downloadJson<ProfileJsonMetadata>(profileAccount.data.metadataUri, scope);
      } catch (error) {
        // TO-DO
      }
    }

    // if (profileAccount.data.authority.toBase58() === ju.identity().publicKey.toBase58()) {
    //   return new ProfileAdmin(
    //     ju,
    //     profileAccount,
    //     metadataJson
    //   );
    // }

    // return new Profile(
    //   ju,
    //   profileAccount,
    //   metadataJson,
    // );

    return toProfile(
      profileAccount,
      metadataJson,
    );
  },
};