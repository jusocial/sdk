import { Profile as ProfileCore, profileDiscriminator } from '@ju-protocol/ju-core'
import type { PublicKey } from '@solana/web3.js';
import { Profile, ProfileJsonMetadata, toProfile } from '../../models';
import { toProfileAccount } from '../../accounts';
import {
  lamports,
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';
import { Option } from '@/utils';

// -----------------
// Operation
// -----------------

const Key = 'FindProfilesOperation' as const;

/**
 * Finds all Profiles for specified Application.
 *
 * ```ts
 * 
 * const profile = await ju
 *   .core()
 *   profiles(app)
 *   .findProfiles(
 *      {
 *        name: 'John'
 *      }
 *   );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findProfilesOperation =
  useOperation<FindProfilesOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindProfilesOperation = Operation<
  typeof Key,
  FindProfilesInput,
  Profile[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindProfilesInput = {
  /** The address of the Application. */
  app: PublicKey;

  /** The Profile's user gender (for additional filtering) */
  gender?: string;

  /** The Profile's first user Name (for additional filtering) */
  firstName?: string;

  /** The Profile's user last name (for additional filtering) */
  lastName?: string;

  /** The Profile's user Country code (for additional filtering) */
  countryCode?: number;

  /** The Profile's user City code (for additional filtering) */
  cityCode?: number;

  /** Verified status (for additional filtering) */
  isVerified?: boolean;

  /**
   * Whether or not we should fetch the JSON Metadata.
   *
   * @defaultValue `false`
   */
  loadJsonMetadata?: boolean;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindProfilesOutput = Profile[];
// export type FindProfilesOutput =  PublicKey[];

/**
 * @group Operations
 * @category Handlers
 */
export const findProfilesOperationHandler: OperationHandler<FindProfilesOperation> =
{
  handle: async (
    operation: FindProfilesOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      app,
      gender,
      firstName,
      lastName,
      countryCode,
      cityCode,
      isVerified,
      loadJsonMetadata = false
    } = operation.input;

    // Building GPA
    const builder = ProfileCore.gpaBuilder();
    // Add discriminator
    builder.addFilter("accountDiscriminator", profileDiscriminator);

    // Add additional filters


    if (app) {
      builder.addFilter("app", app);
    }
    if (gender) {
      builder.addFilter("gender", gender);
    }
    if (firstName) {
      builder.addFilter("firstName", firstName);
    }
    if (lastName) {
      builder.addFilter("lastName", lastName);
    }
    if (countryCode) {
      builder.addFilter("countryCode", countryCode);
    }
    if (cityCode) {
      builder.addFilter("cityCode", cityCode);
    }
    if (isVerified !== undefined) {
      builder.addFilter("isVerified", isVerified);
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

    const profiles: Profile[] = [];

    for (const account of unparsedAccounts) {
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

    return profiles;
  },
};