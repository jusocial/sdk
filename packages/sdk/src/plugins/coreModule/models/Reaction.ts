import { PublicKey } from '@solana/web3.js';
import { ReactionArgs } from '@ju-protocol/ju-core';
import {
  ReactionAccount
} from '../accounts';
import { assert } from '@/utils';


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
