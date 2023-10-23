import { ProfileData } from '@ju-protocol/ju-core';
import {
  FindProfilesByKeyListInput,
  findProfilesByKeyListOperation,
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
  FindProfilesAsKeysByConnectionTargetInput,
  FindProfilesAsKeysByConnectionInitializerInput,
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
    input: Partial<ProfileData> & { connectingProcessor?: PublicKey },
    externalProcessingData?: string,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(createProfileOperation(
        {
          app: this.app,
          data: {
            alias: input.alias === undefined ? null : input.alias,
            metadataUri: input.metadataUri === undefined ? null : input.metadataUri,
            gender: input.gender === undefined ? null : input.gender,
            firstName: input.firstName === undefined ? null : input.firstName,
            lastName: input.lastName === undefined ? null : input.lastName,
            birthDate: input.birthDate === undefined ? null : input.birthDate,
            countryCode: input.countryCode === undefined ? null : input.countryCode,
            regionCode: input.regionCode === undefined ? null : input.regionCode,
            cityCode: input.cityCode === undefined ? null : input.cityCode,
            personalData1: input.personalData1 === undefined ? null : input.personalData1,
            personalData2: input.personalData2 === undefined ? null : input.personalData2,
            personalData3: input.personalData3 === undefined ? null : input.personalData3,
            personalData4: input.personalData4 === undefined ? null : input.personalData4,
            personalData5: input.personalData5 === undefined ? null : input.personalData5,
            personalData6: input.personalData6 === undefined ? null : input.personalData6,
            personalData7: input.personalData7 === undefined ? null : input.personalData7,
            personalData8: input.personalData8 === undefined ? null : input.personalData8,
          },
          externalProcessingData,
          connectingProcessor: input.connectingProcessor,
          loadJsonMetadata: true,
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
            gender: data.gender === undefined ? profile.gender : data.gender,
            firstName: data.firstName === undefined ? profile.firstName : data.firstName,
            lastName: data.lastName === undefined ? profile.lastName : data.lastName,
            birthDate: data.birthDate === undefined ? profile.birthDate : data.birthDate,
            countryCode: data.countryCode === undefined ? profile.countryCode : data.countryCode,
            regionCode: data.regionCode === undefined ? profile.regionCode : data.regionCode,
            cityCode: data.cityCode === undefined ? profile.cityCode : data.cityCode,
            personalData1: data.personalData1 === undefined ? profile.personalData1 : data.personalData1,
            personalData2: data.personalData2 === undefined ? profile.personalData2 : data.personalData2,
            personalData3: data.personalData3 === undefined ? profile.personalData3 : data.personalData3,
            personalData4: data.personalData4 === undefined ? profile.personalData4 : data.personalData4,
            personalData5: data.personalData5 === undefined ? profile.personalData5 : data.personalData5,
            personalData6: data.personalData6 === undefined ? profile.personalData6 : data.personalData6,
            personalData7: data.personalData7 === undefined ? profile.personalData7 : data.personalData7,
            personalData8: data.personalData8 === undefined ? profile.personalData8 : data.personalData8,
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
    filter: Omit<FindProfilesAsKeysByConnectionTargetInput, 'app'>,

    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findProfilesAsKeysByConnectionTargetOperation(filter), options);
  }

  /** {@inheritDoc findProfilesByConnectionInitializerOperation} */
  findProfilesAsKeysByConnectionInitializer(
    filter: Omit<FindProfilesAsKeysByConnectionInitializerInput, 'app'>,

    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findProfilesAsKeysByConnectionInitializerOperation(filter), options);
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