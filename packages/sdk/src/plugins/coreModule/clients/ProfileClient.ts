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


  // /**
  //   * Set the name of the Profile.
  //   * @param {obj} input - Input
  //   * @param {OperationOptions} options - The optional operation options
  //   * @returns {Pomise<UpdateProfileOutput>} The response of the update.
  //   */
  // setProfileFirstName(
  //   input: {
  //     profile: Profile,
  //     firstName?: string,
  //     loadJsonMetadata?: boolean,
  //   },
  //   options?: OperationOptions
  // ) {
  //   return this.updateProfile(input.profile, { firstName: input.firstName }, input.loadJsonMetadata, options);
  // }

  // /**
  //  * Set the surname of the Profile.
  //  * @param {obj} input - Input
  //  * @param {OperationOptions} options - The optional operation options
  //  * @returns {Pomise<UpdateProfileOutput>} The response of the update.
  //  */
  // setProfileLastName(
  //   input: {
  //     profile: Profile,
  //     flasttName?: string,
  //     loadJsonMetadata?: boolean,
  //   },
  //   options?: OperationOptions
  // ) {
  //   return this.updateProfile(input.profile, { lastName: input.flasttName }, input.loadJsonMetadata, options);
  // }

  // /**
  //  * Set the alias of the Profile.
  //  * @param {Profile} profile - The given Profile instance
  //  * @param {string | null} alias - The alias to set.
  //  * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
  //  * @param {OperationOptions} options - The optional operation options
  //  * @returns {Pomise<UpdateProfileOutput>} The response of the update.
  //  */
  // setProfileAlias(
  //   profile: Profile,
  //   alias: string | null,
  //   loadJsonMetadata?: boolean,
  //   options?: OperationOptions
  // ) {
  //   return this.updateProfile(profile, { alias }, loadJsonMetadata, options);
  // }

  // /**
  //  * Set the metadata URI of the Profile.
  //  * @param {Profile} profile - The given Profile instance
  //  * @param {string | null} metadataUri - The metadata URI to set.
  //  * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
  //  * @param {OperationOptions} options - The optional operation options
  //  * @returns {Pomise<UpdateProfileOutput>} The response of the update.
  //  */
  // setProfileMetadataUri(
  //   profile: Profile,
  //   metadataUri: string | null,
  //   loadJsonMetadata?: boolean,
  //   options?: OperationOptions
  // ) {
  //   return this.updateProfile(profile, { metadataUri }, loadJsonMetadata, options);
  // }

  // /**
  //  * Set the status text of the Profile.

  //  * @param {OperationOptions} options - The optional operation options
  //  * @returns {Pomise<UpdateProfileOutput>} The response of the update.
  //  */
  // setProfileStatus(
  //   input: {
  //     profile: Profile,
  //     statusText?: string,
  //     loadJsonMetadata?: boolean,
  //   },
  //   options?: OperationOptions
  // ) {
  //   return this.updateProfile(input.profile, { statusText: input.statusText }, input.loadJsonMetadata, options);
  // }

  // /**
  //  * Set the birth date of the Profile.
  //  * @param {Profile} profile - The given Profile instance
  //  * @param {number} year - The year of birth date.
  //  * @param {number} month - The month of birth date.
  //  * @param {number} day - The day of birth date.
  //  * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
  //  * @param {OperationOptions} options - The optional operation options
  //  * @returns {Pomise<UpdateProfileOutput>} The response of the update.
  //  */
  // setProfileBirthDate(
  //   profile: Profile,
  //   year: number,
  //   month: number,
  //   day: number,
  //   loadJsonMetadata?: boolean,
  //   options?: OperationOptions
  // ) {
  //   return this.updateProfile(
  //     profile,
  //     { birthDate: toBirthDate(year, month, day) },
  //     loadJsonMetadata,
  //     options
  //   );
  // }


  // /**
  //  * Set the country code of the Profile.
  //  * @param {Profile} profile - The given Profile instance
  //  * @param {number | null} countryCode - The country code to set.
  //  * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
  //  * @param {OperationOptions} options - The optional operation options
  //  * @returns {Pomise<UpdateProfileOutput>} The response of the update.
  //  */
  // setProfileCountryCode(
  //   profile: Profile,
  //   countryCode: number | null,
  //   loadJsonMetadata?: boolean,
  //   options?: OperationOptions
  // ) {
  //   return this.updateProfile(profile, { countryCode }, loadJsonMetadata, options);
  // }

  // /**
  //  * Set the city code of the Profile.
  //  * @param {Profile} profile - The given Profile instance
  //  * @param {number | null} cityCode - The city code to set.
  //  * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
  //  * @param {OperationOptions} options - The optional operation options
  //  * @returns {Pomise<UpdateProfileOutput>} The response of the update.
  //  */
  // setProfileCityCode(
  //   profile: Profile,
  //   cityCode: number | null,
  //   loadJsonMetadata?: boolean,
  //   options?: OperationOptions
  // ) {
  //   return this.updateProfile(profile, { cityCode }, loadJsonMetadata, options);
  // }

  // /**
  // * Set the current location of the Profile. 
  // * The location coordinates should include the latitude and longitude.
  // * @param {Profile} profile - The given Profile instance
  // * @param {LocationCoordinates | null} currentLocation - The current location to set.
  // * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
  // * @param {OperationOptions} [options] - The optional operation options.
  // * @returns {Pomise<UpdateProfileOutput>} The response of the update.
  // */
  // setProfileCurrentLocation(
  //   profile: Profile,
  //   currentLocation: LocationCoordinates | null,
  //   loadJsonMetadata?: boolean,
  //   options?: OperationOptions
  // ) {
  //   return this.updateProfile(profile, { currentLocation }, loadJsonMetadata, options);
  // }

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