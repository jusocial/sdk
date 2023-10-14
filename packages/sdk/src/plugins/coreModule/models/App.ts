import { PublicKey } from '@solana/web3.js';
import { AppArgs } from '@ju-protocol/ju-core';
import {
  AppAccount
} from '../accounts';
import { AppJsonMetadata } from './AppJsonMetadata';
import { assert, Option } from '@/utils';


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
