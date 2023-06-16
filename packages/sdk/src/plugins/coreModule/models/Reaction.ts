import { PublicKey } from '@solana/web3.js';
import {
  ReactionArgs,
} from '@ju-protocol/ju-core';
import {
  ReactionAccount
} from '../accounts';
import { assert } from '@/utils';
// import { Ju } from '@/Ju';


/** @group Models */
export type Reaction = ReactionArgs & {
  /** A model identifier to distinguish models in the SDK. */
  readonly model: 'profile';

  /** A Public Keys of the Reaction */
  readonly address: PublicKey;
}

/** @group Model Helpers */
export const isReaction = (value: any): value is Reaction =>
  typeof value === 'object' && value.model === 'metadata';

/** @group Model Helpers */
export function assertReaction(value: any): asserts value is Reaction {
  assert(isReaction(value), `Expected Reaction model`);
}

/** @group Model Helpers */
export const toReaction = (
  account: ReactionAccount
): Reaction => ({
  model: 'profile',
  address: account.publicKey,
  
  ...account.data
});



// /**
//  * Represents a Reaction in the SDK.
//  */
// export class Reaction {
//   /**
//    * A model identifier to distinguish models in the SDK.
//    */
//   static readonly model = 'Reaction';

//   /**
//    * The Ju instance.
//    */
//   readonly ju: Ju;

//   /**
//    * The Reaction address.
//    */
//   readonly address: PublicKey;

//   /**
//    * The Reaction data.
//    */
//   readonly data: ReactionArgs;

//   /**
//    * Creates an instance of Reaction.
//    * @param {Ju} ju - The Ju instance.
//    * @param {ReactionAccount} reactionAccount - The Reaction account.
//    * @param {Option<ReactionJsonMetadata>} [json] - The JSON metadata associated with the Reaction account.
//    */
//   constructor(
//     ju: Ju,
//     reactionAccount: ReactionAccount,
//   ) {
//     this.ju = ju;
//     this.address = reactionAccount.publicKey;
//     this.data = reactionAccount.data;
//   }

//   /**
//    * Checks if a value is an instance of Reaction.
//    * @param {*} value - The value to check.
//    * @returns {boolean} `true` if the value is an instance of Reaction, `false` otherwise.
//    */
//   static isReaction(value: any): value is Reaction {
//     return typeof value === 'object' && value.model === 'Reaction';
//   }

//   /**
//    * Asserts that a value is an instance of Reaction.
//    * @param {*} value - The value to assert.
//    * @throws {Error} If the value is not an instance of Reaction.
//    */
//   static assertReaction(value: any): asserts value is Reaction {
//     assert(this.isReaction(value), 'Expected Reaction type');
//   }
// }