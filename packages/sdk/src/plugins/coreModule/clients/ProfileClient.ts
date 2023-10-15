import { ProfileData } from '@ju-protocol/ju-core';
import {
  FindProfilesByKeyListInput,
  findProfilesByKeyListOperation,
  CreateProfileInput,
  createProfileOperation,
  findProfileByAddressOperation,
  updateProfileOperation,
  deleteProfileOperation,
  FindProfilesInput,
  findProfilesOperation,
  findProfilesAsKeysByConnectionInitializerOperation,
  findProfilesAsKeysByConnectionTargetOperation,
  findProfilesAsKeysOperation,
  FindProfilesAsKeysInput,
} from '../operations';
import { Profile } from '../models';
import { ExternalProcessors } from '../types';
import type { Ju } from '@/Ju';
import { OperationOptions, PublicKey } from '@/types';

/**
 * This client helps to interact with the Ju Application Profiles.
 *
 * You may access this client via the `ju.core().profile` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const profileClient = ju.core().profiles(app);
 * ```
 *
 * @see {@link CoreClient} The `Core` client
 * @group Modules
 */
export class ProfileClient {

  constructor(readonly ju: Ju, readonly app: PublicKey) { }


  /**
   * Get the Profile instance by address (public key).
   * @param {PublicKey} address - The Profile address
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<Profile>} The Profile instance.
   */
  getProfile(
    address: PublicKey,
    loadJsonMetadata = true,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findProfileByAddressOperation(
        {
          profile: address,
          loadJsonMetadata
        },
      ), options);
  }

  /** {@inheritDoc createProfileOperation} */
  createProfile(
    input: Omit<CreateProfileInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(createProfileOperation(
        {
          app: this.app,
          ...input
        }
      ), options);
  }

  /**
   * Update the Profile data.
   * @param {Profile} profile - The given Profile instance
   * @param {Partial<ProfileArgs>} data - The Profile data to update.
   * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<UpdateProfileOutput>} The response of the Profile update.
   */
  updateProfile(
    profile: Profile,
    data: Partial<ProfileData> & Pick<Partial<ExternalProcessors>, 'connectingProcessor'>,
    loadJsonMetadata = true,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(updateProfileOperation(
        {
          app: this.app,
          data: {
            alias: data.alias === undefined ? profile.alias : data.alias,
            metadataUri: data.metadataUri === undefined ? profile.metadataUri : data.metadataUri,
            statusText: data.statusText === undefined ? profile.statusText : data.statusText,
            gender: data.gender === undefined ? profile.gender : data.gender,
            firstName: data.firstName === undefined ? profile.firstName : data.firstName,
            lastName: data.lastName === undefined ? profile.lastName : data.lastName,
            birthDate: data.birthDate === undefined ? profile.birthDate : data.birthDate,
            countryCode: data.countryCode === undefined ? profile.countryCode : data.countryCode,
            regionCode: data.regionCode === undefined ? profile.regionCode : data.regionCode,
            cityCode: data.cityCode === undefined ? profile.cityCode : data.cityCode,
            currentLocation: data.currentLocation === undefined ? profile.currentLocation : data.currentLocation
          },
          currentAlias: profile.alias,
          externalProcessors: {
            connectingProcessor: data?.connectingProcessor === undefined ? profile.connectingProcessor : data?.connectingProcessor,
          },
          loadJsonMetadata
        }
      ),
        options
      );
  }

  /**
   * Delete the given Profile.
   * @param {Profile} profile - The Profile address
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<SendAndConfirmTransactionResponse>} The Profile delete responce.
   */
  deleteProfile(
    profile: Profile,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(deleteProfileOperation(
        {
          app: profile.app,
          profile: profile.address,
          alias: profile.alias
        }
      ),
        options
      );
  }

  /** {@inheritDoc findProfilesOperation} */
  findProfiles(
    filter: Omit<FindProfilesInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findProfilesOperation(
        {
          app: this.app,
          ...filter
        }
      ), options);
  }

  /** {@inheritDoc findProfilesOperation} */
  findProfilesAsKeys(
    filter: Omit<FindProfilesAsKeysInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findProfilesAsKeysOperation(
        {
          app: this.app,
          ...filter
        }
      ), options);
  }

  /** {@inheritDoc findProfilesByConnectionTargetOperation} */
  findProfilesAsKeysByConnectionTarget(
    /** The address (Profile Pubkey) of the Connection target */
    target: PublicKey,

    /** Approved Profiles only */
    approved?: boolean,

    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findProfilesAsKeysByConnectionTargetOperation(
        {
          app: this.app,
          target,
          approved
        }
      ), options);
  }

  /** {@inheritDoc findProfilesByConnectionInitializerOperation} */
  findProfilesAsKeysByConnectionInitializer(
    /** The address (Profile Pubkey) of the Connection initializer */
    initializer?: PublicKey,

    /** Approved Profiles only */
    approved?: boolean,

    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findProfilesAsKeysByConnectionInitializerOperation(
        {
          app: this.app,
          initializer,
          approved
        }
      ), options);
  }

  /** {@inheritDoc findProfilesByKeyListOperation} */
  getProfilesByKeyList(
    input: FindProfilesByKeyListInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findProfilesByKeyListOperation(input), options);
  }

}