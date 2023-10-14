import { PublicKey } from '@solana/web3.js';
import { ConnectionArgs } from '@ju-protocol/ju-core';
import {
  ConnectionAccount
} from '../accounts';
import { assert } from '@/utils';




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