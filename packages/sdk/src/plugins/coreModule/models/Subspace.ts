import { PublicKey } from '@solana/web3.js';
import {
  // ReportType,
  // Subspace as SubspaceCore,
  SubspaceArgs,
} from '@ju-protocol/ju-core';
import {
  SubspaceAccount
} from '../accounts';
import { SubspaceJsonMetadata } from './SubspaceJsonMetadata';
import { assert, Option } from '@/utils';
// import { Ju } from '@/Ju';
// import { OperationOptions } from '@/types';
// import { SendAndConfirmTransactionResponse } from '@/index';


/** @group Models */
export type Subspace<JsonMetadata extends object = SubspaceJsonMetadata> = SubspaceArgs & {
  /** A model identifier to distinguish models in the SDK. */
  readonly model: 'profile';

  /** A Public Keys of the Subspace */
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
export const isSubspace = (value: any): value is Subspace =>
  typeof value === 'object' && value.model === 'metadata';

/** @group Model Helpers */
export function assertSubspace(value: any): asserts value is Subspace {
  assert(isSubspace(value), `Expected Subspace model`);
}

/** @group Model Helpers */
export const toSubspace = (
  account: SubspaceAccount,
  json?: Option<SubspaceJsonMetadata>
): Subspace => ({
  model: 'profile',
  address: account.publicKey,

  metadata: json ?? null,
  jsonLoaded: json !== undefined,
  
  ...account.data
});



// /**
//  * Represents a Subspace in the SDK.
//  */
// export class Subspace {
//   /**
//    * A model identifier to distinguish models in the SDK.
//    */
//   static readonly model = 'Subspace';

//   /**
//    * The Ju instance.
//    */
//   readonly ju: Ju;

//   /**
//    * The Subspace address.
//    */
//   readonly address: PublicKey;

//   /**
//    * The Subspace data.
//    */
//   readonly data: SubspaceArgs;

//   /**
//    * The JSON metadata associated with the Subspace account.
//    */
//   private _metadataJson: Option<SubspaceJsonMetadata>;

//   /**
//    * Creates an instance of Subspace.
//    * @param {Ju} ju - The Ju instance.
//    * @param {SubspaceAccount} subspaceAccount - The Subspace account.
//    * @param {Option<SubspaceJsonMetadata>} [json] - The JSON metadata associated with the Subspace account.
//    */
//   constructor(
//     ju: Ju,
//     subspaceAccount: SubspaceAccount,
//     json?: Option<SubspaceJsonMetadata>,
//   ) {
//     this.ju = ju;
//     this.address = subspaceAccount.publicKey;
//     this.data = subspaceAccount.data;
//     this._metadataJson = json ?? null;
//   }

//   /**
//    * Get the App associated with the Subspace.
//    * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
//    * @param {OperationOptions} options - The optional operation options
//    * @returns {PublicKey} The app associated with the Subspace.
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
//    * Get the Subspace creator Profile instance.
//    * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
//    * @param {OperationOptions} options - The optional operation options
//    * @returns {Profile} The Subspace creatorProfile instance.
//    */
//   getCreator(
//     loadJsonMetadata?: boolean,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().findProfileByAddress(
//       {
//         profile: this.data.creator,
//         loadJsonMetadata
//       },
//       options
//     );
//   }

//   /**
//    * Get the Connection initializers (subscribers) of the Subspace.
//    * @param {boolean} approved - The flag indicates approved only connections to fetch
//    * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
//    * @param {OperationOptions} options - The optional operation options
//    * @returns {Promise<Profile[]>} The followers of the Profile.
//    */
//   getConnectedProfiles(
//     approved?: boolean,
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
//    * Get Publications owned by the current Subspace.
//    * @param {number} limit - The number of Publications to return
//    * @param {OperationOptions} [options] - The optional operation options.
//    * @returns {Promise<Publication[]>} The blockchain response from sending and confirming the transaction.
//    */
//   getPublications(
//     limit?: number,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().findAllPublications(
//       {
//         app: this.data.app,
//         subspace: this.address,
//       },
//       options
//     );
//   }

//   /**
//    * Check if metadataJson loaded, if not - download external metadata from URI and parse into metadataJson
//    * @returns {SubspaceJsonMetadata<string>} The external metadata 
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
//         .downloadJson<SubspaceJsonMetadata>(metadataUri);
//     } catch (error) {
//       // TODO: implement custom error
//       throw ('Error while downloading JSON metadata')
//     }
//   }


//   /**
//    * Create Report for current Subspace
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
//    * Returns the actual byteSize of a {@link Buffer} holding the serialized data of the Profile account
//    */
//   getAccountSize() {
//     return SubspaceCore.byteSize(this.data);
//   }


//   /**
//    * Checks if a value is an instance of Subspace.
//    * @param {*} value - The value to check.
//    * @returns {boolean} `true` if the value is an instance of Subspace, `false` otherwise.
//    */
//   static isSubspace(value: any): value is Subspace {
//     return typeof value === 'object' && value.model === 'Subspace';
//   }

//   /**
//    * Asserts that a value is an instance of Subspace.
//    * @param {*} value - The value to assert.
//    * @throws {Error} If the value is not an instance of Subspace.
//    */
//   static assertSubspace(value: any): asserts value is Subspace {
//     assert(this.isSubspace(value), 'Expected Subspace type');
//   }
// }



// /**
//  * Represents a Subspace instance with Admin access.
//  */
// export class SubspaceAdmin extends Subspace {

//   /**
//    * Update the income connection status for the current Subspace.
//    * @param {PublicKey} initializer - The initializer of the connection.
//    * @param {boolean} approveStatus - The new approval status for the connection.
//    * @param {OperationOptions} [options] - The optional operation options.
//    * @returns {Promise<SendAndConfirmTransactionResponse>} The blockchain response from sending and confirming the transaction.
//    */
//   async updateIncomeConnection(
//     initializer: PublicKey,
//     approveStatus: boolean,
//     options?: OperationOptions
//   ): Promise<SendAndConfirmTransactionResponse> {
//     const { response } = await this.ju.core().updateConnection(
//       {
//         app: this.data.app,
//         initializer,
//         target: this.address,
//         approveStatus
//       },
//       options
//     );
//     return response;
//   }


//   /**
//   * Update the Subspace data.
//   * @param data - The Subspace data to update.
//   * @param {OperationOptions} options - The optional operation options
//   * @returns {Promise<Profile>} Update Subspace instance.
//   */
//   update(
//     data: Partial<SubspaceArgs>,
//     loadJsonMetadata = true,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().updateSubspace(
//       {
//         app: this.data.app,
//         subspace: this.address,
//         data: {
//           alias: data.alias === undefined ? this.data.alias : data.alias,
//           metadataUri: data.metadataUri === undefined ? this.data.metadataUri : data.metadataUri,
//         },
//         currentAlias: this.data.alias,

//         connectingProcessor: data.connectingProcessor === undefined ? this.data.connectingProcessor : data.connectingProcessor,
//         publishingProcessor: data.publishingProcessor === undefined ? this.data.publishingProcessor : data.publishingProcessor,

//         loadJsonMetadata
//       },
//       options
//     );
//   }


//   /**
//    * Delete current Subspace
//    * @param {OperationOptions} options - The optional operation options
//    * @returns {Promise<SendAndConfirmTransactionResponse>} The blockchain response from sending and confirming the transaction
//    */
//   delete(
//     options?: OperationOptions
//   ) {
//     return this.ju.core().deleteSubspace(
//       {
//         app: this.data.app,
//         subspace: this.address
//       },
//       options
//     );
//   }

// }