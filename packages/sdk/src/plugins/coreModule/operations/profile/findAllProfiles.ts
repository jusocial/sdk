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

const Key = 'FindAllProfilesOperation' as const;

/**
 * Finds all Profiles for specified Application.
 *
 * ```ts
 * 
 * const profile = await ju
 *   .core()
 *   .findAllProfiles(
 *      {
 *        app: JP8sM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUQgT,
 *        name: 'John'
 *      }
 *   );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAllProfilesOperation =
  useOperation<FindAllProfilesOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAllProfilesOperation = Operation<
  typeof Key,
  FindAllProfilesInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAllProfilesInput = {
  /** The address of the Application. */
  app: PublicKey;

  /** The Profile's user Name (for additional filtering) */
  name?: string;

  /** The Profile's user Surname (for additional filtering) */
  surname?: string;

  /** The Profile's user Country code (for additional filtering) */
  countryCode?: number;

  /** The Profile's user City code (for additional filtering) */
  cityCode?: number;

  /** Verified status (for additional filtering) */
  verified?: boolean;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindAllProfilesOutput = Profile[];
// export type FindAllProfilesOutput =  PublicKey[];

/**
 * @group Operations
 * @category Handlers
 */
export const findAllProfilesOperationHandler: OperationHandler<FindAllProfilesOperation> =
{
  handle: async (
    operation: FindAllProfilesOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      app,
      name,
      surname,
      countryCode,
      cityCode,
      verified,
    } = operation.input;

    // Building GPA
    const builder =  Profile.gpaBuilder();
    // Add discriminator
    builder.addFilter("accountDiscriminator", profileDiscriminator);
    
    // Add additional filters


    if (app) {
      builder.addFilter("app", app);
    }
    if (name) {
      builder.addFilter("name", name);
    }
    if (surname) {
      builder.addFilter("surname", surname);
    }
    if (countryCode) {
      builder.addFilter("countryCode", countryCode);
    }
    if (cityCode) {
      builder.addFilter("cityCode", cityCode);
    }
    if (verified) {
      builder.addFilter("verified", verified);
    }

    // Limit returned accounts data to minimum
    builder.config.dataSlice = {offset: 0, length: 0};

    const result = await builder.run(ju.connection);

    scope.throwIfCanceled();

    const profileAddresses = result.map((item) => item.pubkey)

    return profileAddresses;
  },
};