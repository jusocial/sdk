import { Profile, profileDiscriminator } from '@ju-protocol/ju-core'
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

const Key = 'FindProfilesAsKeysOperation' as const;

/**
 * Finds all Profiles for specified Application as Public keys Array.
 *
 * ```ts
 * 
 * const profile = await ju
 *   .core()
 *   .profiles(app)
 *   .findProfilesAsKeys(
 *      {
 *        name: 'John'
 *      }
 *   );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findProfilesAsKeysOperation =
  useOperation<FindProfilesAsKeysOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindProfilesAsKeysOperation = Operation<
  typeof Key,
  FindProfilesAsKeysInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindProfilesAsKeysInput = {
  /** The address of the Application. */
  app?: PublicKey;

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

  /** Searchable number of 10-years-period related to birthdate (for additional filtering) */
  age10yearsInterval?: number;

  /** Searchable number of 5-years-period related to birthdate (for additional filtering) */
  age5yearsInterval?: number;
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
export const findProfilesAsKeysOperationHandler: OperationHandler<FindProfilesAsKeysOperation> =
{
  handle: async (
    operation: FindProfilesAsKeysOperation,
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
      age10yearsInterval,
      age5yearsInterval,
    } = operation.input;

    // Building GPA
    const builder =  Profile.gpaBuilder();
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
    if (age10yearsInterval) {
      builder.addFilter("searchable10Years", Math.floor(age10yearsInterval / 10))
    }
    if (age5yearsInterval) {
      builder.addFilter("searchable5Years", Math.floor(age5yearsInterval / 5))
    }

    // Limit returned accounts data to minimum
    builder.config.dataSlice = {offset: 0, length: 0};

    const result = await builder.run(ju.connection);

    scope.throwIfCanceled();

    const profileAddresses = result.map((item) => item.pubkey)

    return profileAddresses;
  },
};