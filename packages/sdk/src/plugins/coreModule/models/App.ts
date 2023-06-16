import { PublicKey } from '@solana/web3.js';
import {
  AppArgs,
  // App as AppCore
} from '@ju-protocol/ju-core';
import {
  AppAccount
} from '../accounts';
import { AppJsonMetadata } from './AppJsonMetadata';
import { assert, Option } from '@/utils';
// import { Ju } from '@/Ju';
// import { OperationOptions } from '@/types';


/** @group Models */
export type App<JsonMetadata extends object = AppJsonMetadata> = AppArgs & {
  /** A model identifier to distinguish models in the SDK. */
  readonly model: 'app';

  /** A Public Keys of the App */
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
export const isApp = (value: any): value is App =>
  typeof value === 'object' && value.model === 'metadata';

/** @group Model Helpers */
export function assertApp(value: any): asserts value is App {
  assert(isApp(value), `Expected App model`);
}

/** @group Model Helpers */
export const toApp = (
  account: AppAccount,
  json?: Option<AppJsonMetadata>
): App => ({
  model: 'app',
  address: account.publicKey,

  metadata: json ?? null,
  jsonLoaded: json !== undefined,
  
  ...account.data
});


// /**
//  * Represents a App in the SDK.
//  */
// export class App {
//   /**
//    * A model identifier to distinguish models in the SDK.
//    */
//   static readonly model = 'App';

//   /**
//    * The Ju instance.
//    */
//   readonly ju: Ju;

//   /**
//    * The App address.
//    */
//   readonly address: PublicKey;

//   /**
//    * The App account data.
//    */
//   readonly data: AppArgs;

//   /**
//    * The JSON metadata associated with the App account.
//    */
//   private _metadataJson: Option<AppJsonMetadata>;

//   /**
//    * Creates an instance of App.
//    * @param {Ju} ju - The Ju instance.
//    * @param {AppAccount} appAccount - The App account.
//    * @param {Option<AppJsonMetadata>} [json] - The JSON metadata associated with the App account.
//    */
//   constructor(
//     ju: Ju,
//     appAccount: AppAccount,
//     json?: Option<AppJsonMetadata>,
//   ) {
//     this.ju = ju;
//     this.address = appAccount.publicKey;
//     this.data = appAccount.data;
//     this._metadataJson = json ?? null;
//   }

//   /**
//    * Check if metadataJson loaded, if not - download external metadata from URI and parse into metadataJson
//    * @returns {AppJsonMetadata<string>} The external metadata 
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
//         .downloadJson<AppJsonMetadata>(metadataUri);
//     } catch (error) {
//       // TODO: implement custom error
//       throw ('Error while downloading JSON metadata')
//     }
//   }

//   /**
//    * Returns the actual byteSize of a {@link Buffer} holding the serialized data of the App account
//    */
//   getAccountSize() {
//     return AppCore.byteSize(this.data);
//   }


//   /**
//    * Checks if a value is an instance of App.
//    * @param {*} value - The value to check.
//    * @returns {boolean} `true` if the value is an instance of App, `false` otherwise.
//    */
//   static isApp(value: any): value is App {
//     return typeof value === 'object' && value.model === 'App';
//   }

//   /**
//    * Asserts that a value is an instance of App.
//    * @param {*} value - The value to assert.
//    * @throws {Error} If the value is not an instance of App.
//    */
//   static assertApp(value: any): asserts value is App {
//     assert(this.isApp(value), 'Expected App type');
//   }
// }


// /**
//  * Represents a App instance with Admin access.
//  */
// export class AppAdmin extends App {

//   /**
//    * Update the Publication data.
//    * @param {AppArgs} data - The Profile data to update.
//    * @param {OperationOptions} options - The optional operation options
//    * @returns {Promise<App>} Update Profile instance.
//    */
//   update(
//     data: Partial<AppArgs>,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().updateApp(
//       {
//         app: this.address,
//         data: {
//           metadataUri: data.metadataUri === undefined ? this.data.metadataUri : data.metadataUri,
//           profileNameRequired: data.profileNameRequired === undefined ? this.data.profileNameRequired : data.profileNameRequired,
//           profileSurnameRequired: data.profileSurnameRequired === undefined ? this.data.profileSurnameRequired : data.profileSurnameRequired,
//           profileBirthdateRequired: data.profileBirthdateRequired === undefined ? this.data.profileBirthdateRequired : data.profileBirthdateRequired,
//           profileCountryRequired: data.profileCountryRequired === undefined ? this.data.profileCountryRequired : data.profileCountryRequired,
//           profileCityRequired: data.profileCityRequired === undefined ? this.data.profileCityRequired : data.profileCityRequired,
//           profileMetadataUriRequired: data.profileMetadataUriRequired === undefined ? this.data.profileMetadataUriRequired : data.profileMetadataUriRequired,
//           subspaceNameRequired: data.subspaceNameRequired === undefined ? this.data.subspaceNameRequired : data.subspaceNameRequired,
//           subspaceMetadataUriRequired: data.subspaceMetadataUriRequired === undefined ? this.data.subspaceMetadataUriRequired : data.subspaceMetadataUriRequired,
//           profileDeleteAllowed: data.profileDeleteAllowed === undefined ? this.data.profileDeleteAllowed : data.profileDeleteAllowed,
//           subspaceDeleteAllowed: data.subspaceDeleteAllowed === undefined ? this.data.subspaceDeleteAllowed : data.subspaceDeleteAllowed,
//           publicationDeleteAllowed: data.publicationDeleteAllowed === undefined ? this.data.publicationDeleteAllowed : data.publicationDeleteAllowed,
//         },
//         externalProcessors: {
//           registeringProcessor: data.registeringProcessor === undefined ? this.data.registeringProcessor : data.registeringProcessor,
//           connectingProcessor: data.connectingProcessor === undefined ? this.data.connectingProcessor : data.connectingProcessor,
//           publishingProcessor: data.publishingProcessor === undefined ? this.data.publishingProcessor : data.publishingProcessor,
//           collectingProcessor: data.collectingProcessor === undefined ? this.data.collectingProcessor : data.collectingProcessor,
//           referencingProcessor: data.referencingProcessor === undefined ? this.data.referencingProcessor : data.referencingProcessor
//         }
//       },
//       options
//     );
//   }

//   updateMetadataUri(metadataUri: string) {
//     return this.update({ metadataUri })
//   }

// }