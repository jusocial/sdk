import { PublicKey } from '@solana/web3.js';
import {
  ConnectionArgs,
} from '@ju-protocol/ju-core';
import {
  ConnectionAccount
} from '../accounts';
import { assert } from '@/utils';
// import { Ju } from '@/Ju';
// import { OperationOptions } from '@/types';



/** @group Models */
export type Connection = ConnectionArgs & {
  /** A model identifier to distinguish models in the SDK. */
  readonly model: 'profile';

  /** A Public Keys of the Connection */
  readonly address: PublicKey;
}

/** @group Model Helpers */
export const isConnection = (value: any): value is Connection =>
  typeof value === 'object' && value.model === 'metadata';

/** @group Model Helpers */
export function assertConnection(value: any): asserts value is Connection {
  assert(isConnection(value), `Expected Connection model`);
}

/** @group Model Helpers */
export const toConnection = (
  account: ConnectionAccount
): Connection => ({
  model: 'profile',
  address: account.publicKey,
  
  ...account.data
});


// /**
//  * Represents a Connection in the SDK.
//  */
// export class Connection {
//   /**
//    * A model identifier to distinguish models in the SDK.
//    */
//   static readonly model = 'Connection';

//   /**
//    * The Ju instance.
//    */
//   readonly ju: Ju;

//   /**
//    * The Connection address.
//    */
//   readonly address: PublicKey;

//   /**
//    * The Connection data.
//    */
//   readonly data: ConnectionArgs;

//   /**
//    * Creates an instance of Connection.
//    * @param {Ju} ju - The Ju instance.
//    * @param {ConnectionAccount} connectionAccount - The Connection account.
//    * @param {Option<ConnectionJsonMetadata>} [json] - The JSON metadata associated with the Connection account.
//    */
//   constructor(
//     ju: Ju,
//     connectionAccount: ConnectionAccount,
//   ) {
//     this.ju = ju;
//     this.address = connectionAccount.publicKey;
//     this.data = connectionAccount.data;
//   }

//   /**
//    * Get the initializer of the Connection.
//    * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
//    * @returns {Profile} The initializer of the Connection.
//    */
//   getInitializer(
//     loadJsonMetadata?: boolean,
//     options?: OperationOptions
//   ) {
//     return this.ju.core().findProfileByAddress(
//       {
//         profile: this.data.initializer,
//         loadJsonMetadata
//       }
//     );
//   }

//   /**
//    * Get the target of the Connection.
//    * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
//    * @returns {Promise<Profile | Subspace>} The target of the Connection.
//    */
//   getTarget(
//     loadJsonMetadata?: boolean,
//     options?: OperationOptions
//   ) {
//     if (this.data.connectionTargetType == 0) {
//       return this.ju.core().findProfileByAddress(
//         {
//           profile: this.data.target,
//           loadJsonMetadata
//         },
//         options
//       );
//     } else if (this.data.connectionTargetType == 1) {
//       return this.ju.core().findSubspaceByAddress(
//         {
//           subspace: this.data.target,
//           loadJsonMetadata
//         },
//         options
//       );
//     }

//     // TODO: Implement custom error
//     throw ('Error while fetching target entity');
//   }

//   /**
//    * Checks if a value is an instance of Connection.
//    * @param {*} value - The value to check.
//    * @returns {boolean} `true` if the value is an instance of Connection, `false` otherwise.
//    */
//   static isConnection(value: any): value is Connection {
//     return typeof value === 'object' && value.model === 'Connection';
//   }

//   /**
//    * Asserts that a value is an instance of Connection.
//    * @param {*} value - The value to assert.
//    * @throws {Error} If the value is not an instance of Connection.
//    */
//   static assertConnection(value: any): asserts value is Connection {
//     assert(this.isConnection(value), 'Expected Connection type');
//   }
// }