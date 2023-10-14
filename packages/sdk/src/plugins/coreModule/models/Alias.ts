import { PublicKey } from '@solana/web3.js';
import { AliasArgs } from '@ju-protocol/ju-core';
import {
  AliasAccount
} from '../accounts';
import { assert } from '@/utils';


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