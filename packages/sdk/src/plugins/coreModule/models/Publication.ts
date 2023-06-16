import { PublicKey } from '@solana/web3.js';
import {
  PublicationArgs,
  // Publication as PublicationCore,
  // ReactionType,
  // ReportType,
} from '@ju-protocol/ju-core';
import {
  PublicationAccount
} from '../accounts';
import { PublicationJsonMetadata } from './PublicationJsonMetadata';
import { assert, Option } from '@/utils';
// import { Ju } from '@/Ju';
// import { OperationOptions } from '@/types';


/** @group Models */
export type Publication<JsonMetadata extends object = PublicationJsonMetadata> = PublicationArgs & {
  /** A model identifier to distinguish models in the SDK. */
  readonly model: 'profile';

  /** A Public Keys of the Publication */
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
export const isPublication = (value: any): value is Publication =>
  typeof value === 'object' && value.model === 'metadata';

/** @group Model Helpers */
export function assertPublication(value: any): asserts value is Publication {
  assert(isPublication(value), `Expected Publication model`);
}

/** @group Model Helpers */
export const toPublication = (
  account: PublicationAccount,
  json?: Option<PublicationJsonMetadata>
): Publication => ({
  model: 'profile',
  address: account.publicKey,

  metadata: json ?? null,
  jsonLoaded: json !== undefined,
  
  ...account.data
});

// /**
//  * Represents a Publication in the SDK.
//  */
// export class Publication {
//   /**
//    * A model identifier to distinguish models in the SDK.
//    */
//   static readonly model = 'Publication';

//   /**
//    * The Ju instance.
//    */
//   readonly ju: Ju;

//   /**
//    * The Publication address.
//    */
//   readonly address: PublicKey;

//   /**
//    * The Publication data.
//    */
//   readonly data: PublicationArgs;

//   /**
//    * The JSON metadata associated with the Publication account.
//    */
//   private _metadataJson: Option<PublicationJsonMetadata>;

//   /**
//    * Creates an instance of Publication.
//    * @param {Ju} ju - The Ju instance.
//    * @param {PublicationAccount} publicationAccount - The Publication account.
//    * @param {Option<PublicationJsonMetadata>} [json] - The JSON metadata associated with the Publication account.
//    */
//   constructor(
//     ju: Ju,
//     publicationAccount: PublicationAccount,
//     json?: Option<PublicationJsonMetadata>,
//   ) {
//     this.ju = ju;
//     this.address = publicationAccount.publicKey;
//     this.data = publicationAccount.data;
//     this._metadataJson = json ?? null;
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
//    * Get the Profile associated with the Publication.
//    * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
//    * @param {OperationOptions} options - The optional operation options
//    * @returns {Promise<Profile>} The Profile associated with the Publication.
//    */
//   getCreator(
//     loadJsonMetadata?: boolean,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().findProfileByAddress(
//       {
//         profile: this.data.profile,
//         loadJsonMetadata
//       },
//       options
//     );
//   }

//   /**
//    * Get the replies of the Publication.
//    * @param {OperationOptions} options - The optional operation options
//    * @returns {Promise<Publication[]>} The reactions of the Publication.
//    */
//   getReplies(
//     options?: OperationOptions
//   ) {
//     return this.ju.core().findAllPublications(
//       {
//         app: this.data.app,
//         isReply: true,
//         targetPublication: this.address
//       },
//       options
//     );
//   }

//   /**
//    * Get the reactions of the Publication.
//    * @param {initializer} initializer - Reaction initializer address for additional filtering
//    * @param {target} target - Reaction target address for additional filtering
//    * @param {reactionType} reactionType - Reaction type for additional filtering (Profile = 0, Subspace = 1)
//    * @param {OperationOptions} options - The optional operation options
//    * @returns {Promise<Reaction[]>} The reactions of the Publication.
//    */
//   getReactions(
//     reactionType?: ReactionType,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().findAllReactions(
//       {
//         app: this.data.app,
//         target: this.address,
//         reactionType
//       },
//       options
//     );
//   }

//   /**
//    * Check if metadataJson loaded, if not - download external metadata from URI and parse into metadataJson
//    * @returns {PublicationJsonMetadata<string>} The external metadata 
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
//         .downloadJson<PublicationJsonMetadata>(metadataUri);
//     } catch (error) {
//       // TODO: implement custom error
//       throw ('Error while downloading JSON metadata')
//     }
//   }

//   /**
//    * Returns the actual byteSize of a {@link Buffer} holding the serialized data of the Publication account
//    */
//   getAccountSize() {
//     return PublicationCore.byteSize(this.data);
//   }


//   /**
//    * Create Reaction for current Publication
//    * @param {ReactionType} reactionType - The Reaction type
//    * @param {OperationOptions} options - The optional operation options
//    */
//   react(
//     reactionType: ReactionType,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().createReaction(
//       {
//         app: this.data.app,
//         target: this.address,
//         reactionType
//       },
//       options
//     )
//   }


//   /**
//    * Create reply for current Publication
//    * @param {string} metadataUri - The metadatata URI of the replying Publication
//    * @param {string} tag - The Tag of the replying Publication
//    * @param {PublicKey} subspace - The Subspace address, in case Publication must be published into subspace
//    * @param {OperationOptions} options - The optional operation options
//    */
//   reply(
//     metadataUri: string,
//     tag?: string,
//     subspace?: PublicKey,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().createPublication(
//       {
//         app: this.data.app,
//         isReply: true,
//         isMirror: false,
//         target: this.address,
//         metadataUri,
//         tag,
//         subspace
//       },
//       options
//     )
//   }


//   /**
//    * Create current Publication mirror
//    * @param {string} metadataUri - The metadatata URI of the mirrorong Publication
//    * @param {string} tag - The Tag of the mirrorong Publication
//    * @param {PublicKey} subspace - The Subspace address, in case Publication must be published into subspace
//    * @param {OperationOptions} options - The optional operation options
//    */
//   mirror(
//     metadataUri: string,
//     tag?: string,
//     subspace?: PublicKey,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().createPublication(
//       {
//         app: this.data.app,
//         isReply: false,
//         isMirror: true,
//         target: this.address,
//         metadataUri,
//         tag,
//         subspace
//       },
//       options
//     )
//   }


//   /**
//    * Create Report for current Publication
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
//    * Checks if a value is an instance of Publication.
//    * @param {*} value - The value to check.
//    * @returns {boolean} `true` if the value is an instance of Publication, `false` otherwise.
//    */
//   static isPublication(value: any): value is Publication {
//     return typeof value === 'object' && value.model === 'Publication';
//   }

//   /**
//    * Asserts that a value is an instance of Publication.
//    * @param {*} value - The value to assert.
//    * @throws {Error} If the value is not an instance of Publication.
//    */
//   static assertPublication(value: any): asserts value is Publication {
//     assert(this.isPublication(value), 'Expected Publication type');
//   }
// }



// /**
//  * Represents a Publication instance with Admin access.
//  */
// export class PublicationAdmin extends Publication {

//   /**
//    * Update the Publication data.
//    * @param data - The Profile data to update.
//    * @param {OperationOptions} options - The optional operation options
//    * @returns {Promise<Profile>} Update Profile instance.
//    */
//   update(
//     data: Partial<PublicationArgs>,
//     loadJsonMetadata = true,
//     options?: OperationOptions
//   ) {
//     // TODO: 
//     // const loadJsonMetadata = true;

//     return this.ju.core().updatePublication(
//       {
//         app: this.data.app,
//         publication: this.address,
//         data: {
//           metadataUri: data.metadataUri === undefined ? this.data.metadataUri : data.metadataUri,
//           isMirror: this.data.isMirror,
//           isReply: this.data.isReply,
//           contentType: data.contentType === undefined ? this.data.contentType : data.contentType,
//           tag: data.tag === undefined ? this.data.tag : data.tag,
//         },
//         collectingProcessor: data.collectingProcessor === undefined ? this.data.collectingProcessor : data.collectingProcessor,
//         referencingProcessor: data.referencingProcessor === undefined ? this.data.referencingProcessor : data.referencingProcessor, 
        
//         loadJsonMetadata
//       },
//       options
//     );
//   }

//   // updateMetadataUri(metadataUri: string) {
//   //   this.update({ metadataUri })
//   // }

//   /**
//    * Delete current Publication
//    * @param {OperationOptions} options - The optional operation options
//    * @returns {Promise<SendAndConfirmTransactionResponse>} The blockchain response from sending and confirming the transaction
//    */
//   delete(
//     options?: OperationOptions
//   ) {
//     return this.ju.core().deletePublication(
//       {
//         app: this.data.app,
//         publication: this.address
//       },
//       options
//     );
//   }

// }