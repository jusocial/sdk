import { Gender, Profile, profileDiscriminator } from '@ju-protocol/ju-core'
import type { PublicKey } from '@solana/web3.js';
import { ageToSearchInterval } from '../../helpers';
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
  app: PublicKey;

  /** The Profile's user gender (for additional filtering) */
  gender?: Gender;

  /** The Profile's first user Name (for additional filtering) */
  firstName?: string;

  /** The Profile's user last name (for additional filtering) */
  lastName?: string;

  /** The Profile's user Country code (for additional filtering) */
  countryCode?: number;

  /** The Profile's user Region code (for additional filtering) */
  regionCode?: number;

  /** The Profile's user City code (for additional filtering) */
  cityCode?: number;

  /** Verified status (for additional filtering) */
  isVerified?: boolean;

  /** Universal personal data 1 (for additional filtering) */
  personalData1?: number;

  /** Universal personal data 2 (for additional filtering) */
  personalData2?: number;

  /** Universal personal data 3 (for additional filtering) */
  personalData3?: number;

  /** Universal personal data 4 (for additional filtering) */
  personalData4?: number;

  /** Universal personal data 5 (for additional filtering) */
  personalData5?: number;

  /** Universal personal data 6 (for additional filtering) */
  personalData6?: number;

  /** Universal personal data 7 (for additional filtering) */
  personalData7?: number;

  /** Universal personal data 8 (for additional filtering) */
  personalData8?: number;

  /** Searchable number of 10-years-period related to birthdate (for additional filtering) */
  birthDate10Years?: number;

  /** Searchable number of 5-years-period related to birthdate (for additional filtering) */
  birthDate5Years?: number;

  /** Searchable number of year related to birthdate (for additional filtering) */
  birthDateYear?: number;

  /** Creation year (for additional filtering) */
  creationYear?: number;

  /** Creation month (for additional filtering) */
  creationMonth?: number;

  /** Creation week (for additional filtering) */
  creationWeek?: number;

  /** Creation day (for additional filtering) */
  creationDay?: number;
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
      regionCode,
      cityCode,
      isVerified,
      personalData1,
      personalData2,
      personalData3,
      personalData4,
      personalData5,
      personalData6,
      personalData7,
      personalData8,
      birthDate10Years,
      birthDate5Years,
      birthDateYear,
      creationYear,
      creationMonth,
      creationWeek,
      creationDay
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
    if (regionCode) {
      builder.addFilter("regionCode", regionCode);
    }
    if (cityCode) {
      builder.addFilter("cityCode", cityCode);
    }
    if (isVerified !== undefined) {
      builder.addFilter("isVerified", isVerified);
    }

    if (personalData1) {
      builder.addFilter("personalData1", personalData1)
    }
    if (personalData2) {
      builder.addFilter("personalData2", personalData2)
    }
    if (personalData3) {
      builder.addFilter("personalData3", personalData3)
    }
    if (personalData4) {
      builder.addFilter("personalData4", personalData4)
    }
    if (personalData5) {
      builder.addFilter("personalData5", personalData5)
    }
    if (personalData6) {
      builder.addFilter("personalData6", personalData6)
    }
    if (personalData7) {
      builder.addFilter("personalData7", personalData7)
    }
    if (personalData8) {
      builder.addFilter("personalData8", personalData8)
    }

    if (birthDate10Years) {
      builder.addFilter("birthDate10Years", ageToSearchInterval(birthDate10Years, 10))
    }
    if (birthDate5Years) {
      builder.addFilter("birthDate5Years", ageToSearchInterval(birthDate5Years, 5))
    }
    if (birthDateYear) {
      builder.addFilter("birthDateYear", ageToSearchInterval(birthDateYear, 1))
    }
    if (creationYear) {
      builder.addFilter("creationYear", creationYear)
    }
    if (creationMonth) {
      builder.addFilter("creationMonth", creationMonth)
    }
    if (creationWeek) {
      builder.addFilter("creationWeek", creationWeek)
    }
    if (creationDay) {
      builder.addFilter("creationDay", creationDay)
    }

    // Limit returned accounts data to minimum
    builder.config.dataSlice = {offset: 0, length: 0};

    const result = await builder.run(ju.connection);

    scope.throwIfCanceled();

    const profileAddresses = result.map((item) => item.pubkey)

    return profileAddresses;
  },
};