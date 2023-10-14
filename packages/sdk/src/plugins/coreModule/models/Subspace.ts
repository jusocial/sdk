import { PublicKey } from '@solana/web3.js';
import { SubspaceArgs } from '@ju-protocol/ju-core';
import { SubspaceAccount } from '../accounts';
import { bytesArrToStr } from '../helpers';
import { SubspaceJsonMetadata } from './JsonMetadata';
import { assert, Option } from '@/utils';


/** @group Models */
export type Subspace<JsonMetadata extends object = SubspaceJsonMetadata> = Omit<SubspaceArgs, 'name'> & {
  /** A model identifier to distinguish models in the SDK. */
  readonly model: 'subspace';

  /** A Public Keys of the Subspace */
  readonly address: PublicKey;

  /** The JSON metadata associated with the metadata account. */
  readonly metadata: Option<JsonMetadata>;

  /**  Because `name` is byte array in core program - needs to convert to string */
  name: string;

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
): Subspace => {

  const { name, ...omittedData } = account.data;
  const nameAsStr = bytesArrToStr(name);

  const profile:Subspace = {
    model: 'subspace',
    address: account.publicKey,

    metadata: json ?? null,
    jsonLoaded: json !== undefined,

    name: nameAsStr,
    
    ...omittedData
  }

  return profile;
};