import { PublicKey } from '@solana/web3.js';
import {
  AliasArgs,
} from '@ju-protocol/ju-core';
import {
  AliasAccount
} from '../accounts';
import { assert } from '@/utils';
// import { Ju } from '@/Ju';
// import { OperationOptions } from '@/types';


/** @group Models */
export type Alias = AliasArgs & {
  /** A model identifier to distinguish models in the SDK. */
  readonly model: 'profile';

  /** A Public Keys of the Alias */
  readonly address: PublicKey;
}

/** @group Model Helpers */
export const isAlias = (value: any): value is Alias =>
  typeof value === 'object' && value.model === 'metadata';

/** @group Model Helpers */
export function assertAlias(value: any): asserts value is Alias {
  assert(isAlias(value), `Expected Alias model`);
}

/** @group Model Helpers */
export const toAlias = (
  account: AliasAccount
): Alias => ({
  model: 'profile',
  address: account.publicKey,
  
  ...account.data
});


// /**
//  * Represents a Alias in the SDK.
//  */
// export class Alias {
//   /**
//    * A model identifier to distinguish models in the SDK.
//    */
//   static readonly model = 'Alias';

//   /**
//    * The Ju instance.
//    */
//   readonly ju: Ju;

//   /**
//    * The Alias address.
//    */
//   readonly address: PublicKey;

//   /**
//    * The Alias data.
//    */
//   readonly data: AliasArgs;

//   /**
//    * Creates an instance of Alias.
//    * @param {Ju} ju - The Ju instance.
//    * @param {AliasAccount} aliasAccount - The Alias account.
//    * @param {Option<AliasJsonMetadata>} [json] - The JSON metadata associated with the Alias account.
//    */
//   constructor(
//     ju: Ju,
//     aliasAccount: AliasAccount,
//   ) {
//     this.ju = ju;
//     this.address = aliasAccount.publicKey;
//     this.data = aliasAccount.data;
//   }

//   /**
//    * Get the Alias owner Profile instance.
//    * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
//    * @returns {Profile} The Alias owner Profile instance.
//    */
//   getOwner(
//     loadJsonMetadata?: boolean,
//     options?: OperationOptions
//   ) {
//     const { aliasType } = this.data;

//     if (aliasType == 0) {
//       // Retrieve Profile
//       return this.ju
//         .core()
//         .findProfileByAddress(
//           {
//             profile: this.data.owner,
//             loadJsonMetadata
//           },
//           options
//         );

//     } else if (aliasType == 1) {
//       // Retrieve Subspace
//       return this.ju
//         .core()
//         .findSubspaceByAddress(
//           {
//             subspace: this.data.owner,
//             loadJsonMetadata
//           },
//           options
//         );
//     }

//     // TODO: Implement custom error
//     throw ('Error while fetching Alias owner')
//   }

//   /**
//    * Checks if a value is an instance of Alias.
//    * @param {*} value - The value to check.
//    * @returns {boolean} `true` if the value is an instance of Alias, `false` otherwise.
//    */
//   static isAlias(value: any): value is Alias {
//     return typeof value === 'object' && value.model === 'Alias';
//   }

//   /**
//    * Asserts that a value is an instance of Alias.
//    * @param {*} value - The value to assert.
//    * @throws {Error} If the value is not an instance of Alias.
//    */
//   static assertAlias(value: any): asserts value is Alias {
//     assert(this.isAlias(value), 'Expected Alias type');
//   }
// }