import { LocationCoordinates, ProfileArgs } from '@ju-protocol/ju-core';
import {
  FindAllProfilesByKeyListInput,
  findAllProfilesByKeyListOperation,
  CreateProfileInput,
  createProfileOperation,
  findProfileByAddressOperation,
  updateProfileOperation,
  deleteProfileOperation,
  FindAllProfilesInput,
  findAllProfilesOperation,
  FindAllProfilesByConnectionTargetInput,
  FindAllProfilesByConnectionInitializerInput,
  findAllProfilesByConnectionInitializerOperation,
  findAllProfilesByConnectionTargetOperation,
} from '../operations';
import { Profile } from '../models';
import { toBirthDate } from '../helpers';
import type { Ju } from '@/Ju';
import { OperationOptions, PublicKey } from '@/types';

/**
 * This client helps to interact with the Ju Application Profiles.
 *
 * You may access this client via the `ju.core().profile` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const profileClient = ju.core().profile;
 * ```
 *
 * @see {@link CoreClient} The `Core` client
 * @group Modules
 */
export class ProfileClient {

  constructor(readonly ju: Ju) { }


  /**
   * Get the Profile instance by address (public key).
   * @param {PublicKey} address - The Profile address
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<Profile>} The Profile instance.
   */
  get(
    address: PublicKey,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findProfileByAddressOperation(
        {
          profile: address,
          loadJsonMetadata: true
        },
      ), options);
  }

  /** {@inheritDoc createProfileOperation} */
  create(input: CreateProfileInput, options?: OperationOptions) {
    return this.ju
      .operations()
      .execute(createProfileOperation(input), options);
  }

  /**
   * Update the Profile data.
   * @param {Profile} profile - The given Profile instance
   * @param {Partial<ProfileArgs>} data - The Profile data to update.
   * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<UpdateProfileOutput>} The response of the Profile update.
   */
  update(
    profile: Profile,
    data: Partial<ProfileArgs>,
    loadJsonMetadata = true,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(updateProfileOperation(
        {
          app: profile.app,
          data: {
            alias: data.alias === undefined ? profile.alias : data.alias,
            metadataUri: data.metadataUri === undefined ? profile.metadataUri : data.metadataUri,
            statusText: data.statusText === undefined ? profile.statusText : data.statusText,
            name: data.name === undefined ? profile.name : data.name,
            surname: data.surname === undefined ? profile.surname : data.surname,
            birthDate: data.birthDate === undefined ? profile.birthDate : data.birthDate,
            countryCode: data.countryCode === undefined ? profile.countryCode : data.countryCode,
            cityCode: data.cityCode === undefined ? profile.cityCode : data.cityCode,
            currentLocation: data.currentLocation === undefined ? profile.currentLocation : data.currentLocation
          },
          currentAlias: profile.alias,
          externalProcessors: {
            connectingProcessor: data.connectingProcessor === undefined ? profile.connectingProcessor : data.connectingProcessor,
          },
          loadJsonMetadata
        }
      ),
        options
      );
  }


  /**
    * Set the name of the Profile.
    * @param {Profile} profile - The given Profile instance
    * @param {string | null} name - The name to set.
    * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
    * @param {OperationOptions} options - The optional operation options
    * @returns {Pomise<UpdateProfileOutput>} The response of the update.
    */
  setName(
    profile: Profile,
    name: string | null,
    loadJsonMetadata?: boolean,
    options?: OperationOptions
  ) {
    return this.update(profile, { name }, loadJsonMetadata, options);
  }

  /**
   * Set the surname of the Profile.
   * @param {Profile} profile - The given Profile instance
   * @param {string | null} surname - The surname to set.
   * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<UpdateProfileOutput>} The response of the update.
   */
  setSurname(
    profile: Profile,
    surname: string | null,
    loadJsonMetadata?: boolean,
    options?: OperationOptions
  ) {
    return this.update(profile, { surname }, loadJsonMetadata, options);
  }

  /**
   * Set the alias of the Profile.
   * @param {Profile} profile - The given Profile instance
   * @param {string | null} alias - The alias to set.
   * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<UpdateProfileOutput>} The response of the update.
   */
  setAlias(
    profile: Profile,
    alias: string | null,
    loadJsonMetadata?: boolean,
    options?: OperationOptions
  ) {
    return this.update(profile, { alias }, loadJsonMetadata, options);
  }

  /**
   * Set the metadata URI of the Profile.
   * @param {Profile} profile - The given Profile instance
   * @param {string | null} metadataUri - The metadata URI to set.
   * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<UpdateProfileOutput>} The response of the update.
   */
  setMetadataUri(
    profile: Profile,
    metadataUri: string | null,
    loadJsonMetadata?: boolean,
    options?: OperationOptions
  ) {
    return this.update(profile, { metadataUri }, loadJsonMetadata, options);
  }

  /**
   * Set the status text of the Profile.
   * @param {Profile} profile - The given Profile instance
   * @param {string | null} statusText - The status text to set.
   * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<UpdateProfileOutput>} The response of the update.
   */
  setStatus(
    profile: Profile,
    statusText: string | null,
    loadJsonMetadata?: boolean,
    options?: OperationOptions
  ) {
    return this.update(profile, { statusText }, loadJsonMetadata, options);
  }

  /**
   * Set the birth date of the Profile.
   * @param {Profile} profile - The given Profile instance
   * @param {number} year - The year of birth date.
   * @param {number} month - The month of birth date.
   * @param {number} day - The day of birth date.
   * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<UpdateProfileOutput>} The response of the update.
   */
  setBirthDate(
    profile: Profile,
    year: number,
    month: number,
    day: number,
    loadJsonMetadata?: boolean,
    options?: OperationOptions
  ) {
    return this.update(
      profile, 
      { birthDate: toBirthDate(year, month, day) },
      loadJsonMetadata, 
      options
      );
  }

  /**
   * Delete the birth date of the Profile.
   * @param {Profile} profile - The given Profile instance
   * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<UpdateProfileOutput>} The response of the update.
   */
  deleteBirthDate(
    profile: Profile,
    loadJsonMetadata?: boolean,
    options?: OperationOptions
  ) {
    return this.update(
      profile, 
      { birthDate: null },
      loadJsonMetadata, 
      options
      );
  }

  /**
   * Set the country code of the Profile.
   * @param {Profile} profile - The given Profile instance
   * @param {number | null} countryCode - The country code to set.
   * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<UpdateProfileOutput>} The response of the update.
   */
  setCountryCode(
    profile: Profile,
    countryCode: number | null,
    loadJsonMetadata?: boolean,
    options?: OperationOptions
  ) {
    return this.update(profile, { countryCode }, loadJsonMetadata, options);
  }

  /**
   * Set the city code of the Profile.
   * @param {Profile} profile - The given Profile instance
   * @param {number | null} cityCode - The city code to set.
   * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<UpdateProfileOutput>} The response of the update.
   */
  setCityCode(
    profile: Profile,
    cityCode: number | null,
    loadJsonMetadata?: boolean,
    options?: OperationOptions
  ) {
    return this.update(profile, { cityCode }, loadJsonMetadata, options);
  }

  /**
  * Set the current location of the Profile. 
  * The location coordinates should include the latitude and longitude.
  * @param {Profile} profile - The given Profile instance
  * @param {LocationCoordinates | null} currentLocation - The current location to set.
  * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
  * @param {OperationOptions} [options] - The optional operation options.
  * @returns {Pomise<UpdateProfileOutput>} The response of the update.
  */
  setCurrentLocation(
    profile: Profile,
    currentLocation: LocationCoordinates | null,
    loadJsonMetadata?: boolean,
    options?: OperationOptions
  ) {
    return this.update(profile, { currentLocation }, loadJsonMetadata, options);
  }


  /**
   * Delete the given Profile.
   * @param {Profile} profile - The Profile address
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<SendAndConfirmTransactionResponse>} The Profile delete responce.
   */
  delete(
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

  /** {@inheritDoc findAllProfilesOperation} */
  keysByFilter(
    input: FindAllProfilesInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllProfilesOperation(input), options);
  }

  /** {@inheritDoc findAllProfilesByConnectionTargetOperation} */
  findByConnectionTarget(
    input: FindAllProfilesByConnectionTargetInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllProfilesByConnectionTargetOperation(input), options);
  }

  /** {@inheritDoc findAllProfilesByConnectionInitializerOperation} */
  findByConnectionInitializer(
    input: FindAllProfilesByConnectionInitializerInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllProfilesByConnectionInitializerOperation(input), options);
  }

  /** {@inheritDoc findAllProfilesByKeyListOperation} */
  findByKeyList(
    input: FindAllProfilesByKeyListInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllProfilesByKeyListOperation(input), options);
  }

}