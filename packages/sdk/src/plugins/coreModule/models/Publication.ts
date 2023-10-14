import { PublicKey } from '@solana/web3.js';
import { PublicationArgs } from '@ju-protocol/ju-core';
import {
  PublicationAccount
} from '../accounts';
import { bytesArrToStr } from '../helpers';
import { PublicationJsonMetadata } from './JsonMetadata';
import { assert, Option } from '@/utils';


/** @group Models */
export type Publication<JsonMetadata extends object = PublicationJsonMetadata> = Omit<PublicationArgs, 'tag'> & {
  /** A model identifier to distinguish models in the SDK. */
  readonly model: 'publication';

  /** A Public Keys of the Publication */
  readonly address: PublicKey;

  /** The JSON metadata associated with the metadata account. */
  readonly metadata: Option<JsonMetadata>;

  /**  Because `tag` is byte array in core program - needs to convert to string */
  tag: string;

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
): Publication => {

  const { tag, ...omittedData } = account.data;
  const tagAsStr = bytesArrToStr(tag);

  const profile:Publication = {
    model: 'publication',
    address: account.publicKey,

    metadata: json ?? null,
    jsonLoaded: json !== undefined,

    tag: tagAsStr,
    
    ...omittedData
  }

  return profile;
};
