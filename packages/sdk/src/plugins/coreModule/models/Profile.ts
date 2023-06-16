import { PublicKey } from '@solana/web3.js';
import {
  // LocationCoordinates,
  // Profile as ProfileCore,
  ProfileArgs,
  // ReportType,
} from '@ju-protocol/ju-core';
// import { bignum } from '@metaplex-foundation/beet';
import {
  ProfileAccount
} from '../accounts';
import { ProfileJsonMetadata } from './ProfileJsonMetadata';
import { assert, Option } from '@/utils';
// import { Ju } from '@/Ju';
// import { OperationOptions } from '@/types';
// import { SendAndConfirmTransactionResponse } from '@/index';


/** @group Models */
export type Profile<JsonMetadata extends object = ProfileJsonMetadata> = ProfileArgs & {
  /** A model identifier to distinguish models in the SDK. */
  readonly model: 'profile';

  /** A Public Keys of the Profile */
  readonly address: PublicKey;

  /** The JSON metadata associated with the metadata account. */
  readonly metadata: Option<JsonMetadata>;

  /**
   * Whether or not the JSON metadata was loaded in the first place.
   * When this is `false`, the `json` property is should be ignored.
   */
  readonly jsonLoaded: boolean;
}

/** @group Model Helpers */
export const isProfile = (value: any): value is Profile =>
  typeof value === 'object' && value.model === 'metadata';

/** @group Model Helpers */
export function assertProfile(value: any): asserts value is Profile {
  assert(isProfile(value), `Expected Profile model`);
}

/** @group Model Helpers */
export const toProfile = (
  account: ProfileAccount,
  json?: Option<ProfileJsonMetadata>
): Profile => ({
  model: 'profile',
  address: account.publicKey,

  metadata: json ?? null,
  jsonLoaded: json !== undefined,
  
  ...account.data
});



// /**
//  * Represents the coordinates of a location.
//  * @typedef {Object} LocationCoordinates
//  * @property {number} latitude - The latitude of the location.
//  * @property {number} longitude - The longitude of the location.
//  */


// /**
//  * Represents a Profile in the SDK.
//  */
// export class Profile {
//   /**
//    * A model identifier to distinguish models in the SDK.
//    */
//   static readonly model = 'Profile';

//   /**
//    * The Ju instance.
//    */
//   readonly ju: Ju;

//   /**
//    * The Profile address.
//    */
//   readonly address: PublicKey;

//   /**
//    * The Profile data.
//    */
//   readonly data: ProfileArgs;

//   /**
//    * The JSON metadata associated with the Profile account.
//    */
//   private _metadataJson: Option<ProfileJsonMetadata>;

//   /**
//    * Whether or not the JSON metadata was loaded in the first place.
//    * When this is `false`, the `_metadataJson` property is should be ignored.
//    */
//   readonly metadataJsonLoaded: boolean;

//   /**
//    * Creates an instance of Profile.
//    * @param {Ju} ju - The Ju instance.
//    * @param {ProfileAccount} profileAccount - The Profile account.
//    * @param {Option<ProfileJsonMetadata>} [json] - The JSON metadata associated with the Profile account.
//    */
//   constructor(
//     ju: Ju,
//     profileAccount: ProfileAccount,
//     json?: Option<ProfileJsonMetadata>,
//   ) {
//     this.ju = ju;
//     this.address = profileAccount.publicKey;
//     this.data = profileAccount.data;
//     this._metadataJson = json ?? null;
//     this.metadataJsonLoaded = json !== null;
//   }


//   /**
//    * Get the App associated with the Publication.
//    * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
//    * @param {OperationOptions} options - The optional operation options
//    * @returns {Promise<App>} The App associated with the Publication.
//    */
//   getApp(
//     loadJsonMetadata?: boolean,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().findAppByAddress(
//       {
//         address: this.data.app,
//         loadJsonMetadata
//       },
//       options
//     );
//   }

//   /**
//    * Get the followers of the Profile.
//    * @param {boolean} approved - The flag indicates approved only connections to fetch
//    * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
//    * @param {OperationOptions} options - The optional operation options
//    * @returns {Promise<PublicKey[]>} The followers of the Profile.
//    */
//   getConnectedProfiles(
//     approved?: boolean,
//     loadJsonMetadata?: boolean,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().findAllProfilesByConnectionTarget(
//       {
//         app: this.data.app,
//         target: this.address,
//         approved
//       },
//       options
//     );
//   }

//   /**
//    * Get the followed Profiles.
//    * @param {boolean} approved - The flag indicates approved only connections to fetch
//    * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
//    * @param {OperationOptions} options - The optional operation options
//    * @returns {Promise<PublicKey[]>} The followed Profiles.
//    */
//   getFollowedProfiles(
//     approved?: boolean,
//     loadJsonMetadata?: boolean,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().findAllProfilesByConnectionInitializer(
//       {
//         app: this.data.app,
//         initializer: this.address,
//         approved
//       },
//       options
//     );
//   }


//   /**
//    * Get Publications owned by the current Profile.
//    * @param {number} limit - The number of Publications to return
//    * @param {OperationOptions} [options] - The optional operation options.
//    * @returns {Promise<Publication[]>} The blockchain response from sending and confirming the transaction.
//    */
//   getPublications(
//     limit?: number,
//     options?: OperationOptions
//   ): Promise<PublicKey[]> {
//     return this.ju.core().findAllPublications(
//       {
//         app: this.data.app,
//         profile: this.address,
//       },
//       options
//     );
//   }


//   /**
//    * Get Subspaces subscribed by Profile.
//    * @param {boolean} approved - The flag indicates approved only connections to fetch
//    * @param {number} limit - The number of Publications to return
//    * @param {OperationOptions} options - The optional operation options.
//    * @returns {Promise<Publication[]>} The array of Subspaces subscribed by Profile.
//    */
//   getSubspaces(
//     approved?: boolean,
//     limit?: number,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().findAllSubspacesByConnectionInitializer(
//       {
//         app: this.data.app,
//         initializer: this.address,
//         approved
//       },
//       options
//     );
//   }


//   /**
//    * Пуе Subspaces owned by Profile.
//    * @param {number} limit - The number of Publications to return
//    * @param {OperationOptions} options - The optional operation options.
//    * @returns {Promise<PublicKey[]>} The array of Subspaces public keys.
//    */
//   getOwnedSubspaces(
//     limit?: number,
//     options?: OperationOptions
//   ): Promise<PublicKey[]> {
//     return this.ju.core().findAllSubspacesByConnectionTarget(
//       {
//         app: this.data.app,
//         target: this.address
//       },
//       options
//     );
//   }

//   /**
//    * Check if metadataJson loaded, if not - download external metadata from URI and parse into metadataJson
//    * @returns {ProfileJsonMetadata<string>} The external metadata 
//    */
//   async getMetadata() {
//     if (this._metadataJson) {
//       return this._metadataJson;
//     }
//     const { metadataUri } = this.data
//     if (!metadataUri) {
//       return null;
//     }
//     try {
//       return this.ju
//         .storage()
//         .downloadJson<ProfileJsonMetadata>(metadataUri);
//     } catch (error) {
//       // TODO: implement custom error
//       throw ('Error while downloading JSON metadata')
//     }
//   }


//   /**
//    * Returns the actual byteSize of a {@link Buffer} holding the serialized data of the Profile account
//    */
//   getAccountSize() {
//     return ProfileCore.byteSize(this.data);
//   }


//   /**
//    * Create Report for current Profile
//    * @param {ReportType} reportType - The Report type
//    * @param {string} notificationString - The Report description
//    * @param {OperationOptions} options - The optional operation options
//    */
//   report(
//     reportType: ReportType,
//     notificationString: string | null = null,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().createReport(
//       {
//         app: this.data.app,
//         target: this.address,
//         reportType,
//         notificationString
//       },
//       options
//     )
//   }


//   /**
//    * Checks if a value is an instance of Profile.
//    * @param {*} value - The value to check.
//    * @returns {boolean} `true` if the value is an instance of Profile, `false` otherwise.
//    */
//   static isProfile(value: any): value is Profile {
//     return typeof value === 'object' && value.model === 'Profile';
//   }

//   /**
//    * Asserts that a value is an instance of Profile.
//    * @param {*} value - The value to assert.
//    * @throws {Error} If the value is not an instance of Profile.
//    */
//   static assertProfile(value: any): asserts value is Profile {
//     assert(this.isProfile(value), 'Expected Profile type');
//   }
// }



// /**
//  * Represents a Profile instance with Admin access.
//  */
// export class ProfileAdmin extends Profile {

//     /**
//    * Update the income connection status for the current Profile.
//    * @param {PublicKey} address - The Target of the connection.
//    * @param {OperationOptions} [options] - The optional operation options.
//    * @returns {Promise<SendAndConfirmTransactionResponse>} The blockchain response from sending and confirming the transaction.
//    */
//     async connectTo(
//       target: PublicKey,
//       options?: OperationOptions
//     ): Promise<SendAndConfirmTransactionResponse> {
//       const { response } = await this.ju.core().createConnection(
//         {
//           app: this.data.app,
//           target,
//         },
//         options
//       );
//       return response;
//     }
  
  
//     /**
//      * Update the income connection status for the current Profile.
//      * @param {PublicKey} initializer - The initializer of the connection.
//      * @param {boolean} approveStatus - The new approval status for the connection.
//      * @param {OperationOptions} [options] - The optional operation options.
//      * @returns {Promise<SendAndConfirmTransactionResponse>} The blockchain response from sending and confirming the transaction.
//      */
//     async updateIncomeConnection(
//       initializer: PublicKey,
//       approveStatus: boolean,
//       options?: OperationOptions
//     ): Promise<SendAndConfirmTransactionResponse> {
//       const { response } = await this.ju.core().updateConnection(
//         {
//           app: this.data.app,
//           initializer,
//           target: this.address,
//           approveStatus
//         },
//         options
//       );
//       return response;
//     }
  
//     /**
//      * Delete the outcome Connection for the current Profile.
//      * @param {PublicKey} target - The Target of the connection.
//      * @param {OperationOptions} [options] - The optional operation options.
//      * @returns {Promise<SendAndConfirmTransactionResponse>} The blockchain response from sending and confirming the transaction.
//      */
//     async deleteConnection(
//       target: PublicKey,
//       options?: OperationOptions
//     ): Promise<SendAndConfirmTransactionResponse> {
//       const { response } = await this.ju.core().deleteConnection(
//         {
//           app: this.data.app,
//           target,
//         },
//         options
//       );
//       return response;
//     }
  
//     /**
//      * Update the Profile data.
//      * @param data - The Profile data to update.
//      * @param {OperationOptions} options - The optional operation options
//      * @returns {Promise<Profile>} Update Profile instance.
//      */
//     update(
//       data: Partial<ProfileArgs>,
//       loadJsonMetadata?: boolean,
//       options?: OperationOptions
//     ) {
  
//       return this.ju.core().updateProfile(
//         {
//           app: this.data.app,
//           data: {
//             alias: data.alias === undefined ? this.data.alias : data.alias,
//             metadataUri: data.metadataUri === undefined ? this.data.metadataUri : data.metadataUri,
//             statusText: data.statusText === undefined ? this.data.statusText : data.statusText,
//             name: data.name === undefined ? this.data.name : data.name,
//             surname: data.surname === undefined ? this.data.surname : data.surname,
//             birthDate: data.birthDate === undefined ? this.data.birthDate : data.birthDate,
//             countryCode: data.countryCode === undefined ? this.data.countryCode : data.countryCode,
//             cityCode: data.cityCode === undefined ? this.data.cityCode : data.cityCode,
//             currentLocation: data.currentLocation === undefined ? this.data.currentLocation : data.currentLocation,
//             connectingProcessorToAssign: data.connectingProcessor === undefined ? this.data.connectingProcessor : data.connectingProcessor,
//           },
//           currentAlias: this.data.alias,
//           externalProcessors: {
//             connectingProcessor: data.connectingProcessor === undefined ? this.data.connectingProcessor : data.connectingProcessor,
//           },
//           loadJsonMetadata
//         },
//         options
//       );
//     }
  
//     updateMetadataUri(
//       metadataUri: string | null,
//       loadJsonMetadata?: boolean,
//       options?: OperationOptions
//       ) {
//       return this.update({ metadataUri }, loadJsonMetadata, options)
//     }
  
  
//     /**
//     * Set the name of the Profile.
//     * @param name - The name to set.
//     * @param {OperationOptions} options - The optional operation options
//     * @returns The response of the update.
//     */
//     setName(
//       name: string | null,
//       loadJsonMetadata?: boolean,
//       options?: OperationOptions   
//     ) {
//       return this.update({ name }, loadJsonMetadata, options);
//     }
  
//     /**
//      * Set the surname of the Profile.
//      * @param surname - The surname to set.
//      * @param {OperationOptions} options - The optional operation options
//      * @returns The response of the update.
//      */
//     setSurname(
//       surname: string | null,
//       loadJsonMetadata?: boolean,
//       options?: OperationOptions
//     ) {
//       return this.update({ surname }, loadJsonMetadata, options);
//     }
  
//     /**
//      * Set the alias of the Profile.
//      * @param alias - The alias to set.
//      * @param {OperationOptions} options - The optional operation options
//      * @returns The response of the update.
//      */
//     setAlias(
//       alias: string | null,
//       loadJsonMetadata?: boolean,
//       options?: OperationOptions
//     ) {
//       return this.update({ alias }, loadJsonMetadata, options);
//     }
  
//     /**
//      * Set the metadata URI of the Profile.
//      * @param metadataUri - The metadata URI to set.
//      * @param {OperationOptions} options - The optional operation options
//      * @returns The response of the update.
//      */
//     setMetadataUri(
//       metadataUri: string | null,
//       loadJsonMetadata?: boolean,
//       options?: OperationOptions
//     ) {
//       return this.update({ metadataUri }, loadJsonMetadata, options);
//     }
  
//     /**
//      * Set the status text of the Profile.
//      * @param statusText - The status text to set.
//      * @param {OperationOptions} options - The optional operation options
//      * @returns The response of the update.
//      */
//     setStatus(
//       statusText: string | null,
//       loadJsonMetadata?: boolean,
//       options?: OperationOptions
//     ) {
//       return this.update({ statusText }, loadJsonMetadata, options);
//     }
  
//     /**
//      * Set the birth date of the Profile.
//      * @param birthDate - The birth date to set.
//      * @param {OperationOptions} options - The optional operation options
//      * @returns The response of the update.
//      */
//     setBirthDate(
//       birthDate: bignum | null,
//       loadJsonMetadata?: boolean,
//       options?: OperationOptions
//     ) {
//       return this.update({ birthDate }, loadJsonMetadata, options);
//     }
  
//     /**
//      * Set the country code of the Profile.
//      * @param countryCode - The country code to set.
//      * @param {OperationOptions} options - The optional operation options
//      * @returns The response of the update.
//      */
//     setCountryCode(
//       countryCode: number | null,
//       loadJsonMetadata?: boolean,
//       options?: OperationOptions
//     ) {
//       return this.update({ countryCode }, loadJsonMetadata, options);
//     }
  
//     /**
//      * Set the city code of the Profile.
//      * @param cityCode - The city code to set.
//      * @param {OperationOptions} options - The optional operation options
//      * @returns The response of the update.
//      */
//     setCityCode(
//       cityCode: number | null,
//       loadJsonMetadata?: boolean,
//       options?: OperationOptions
//     ) {
//       return this.update({ cityCode }, loadJsonMetadata, options);
//     }
  
//     /**
//     * Set the current location of the Profile.
//     * @param {LocationCoordinates} currentLocation - The current location to set.
//     * The location coordinates should include the latitude and longitude.
//     * @param {OperationOptions} [options] - The optional operation options.
//     * @returns {any} The response of the update.
//     */
//     setCurrentLocation(
//       currentLocation: LocationCoordinates | null,
//       loadJsonMetadata?: boolean,
//       options?: OperationOptions
//     ) {
//       return this.update({ currentLocation }, loadJsonMetadata, options);
//     }
  
  
//     /**
//      * Delete current Profile
//      * @param {OperationOptions} options - The optional operation options
//      * @returns {Promise<SendAndConfirmTransactionResponse>} The blockchain response from sending and confirming the transaction
//      */
//     delete(
//       options?: OperationOptions
//     ) {
//       return this.ju.core().deleteProfile(
//         {
//           app: this.data.app,
//           profile: this.address,
//           alias: this.data.alias
//         },
//         options
//       );
//     }

// }