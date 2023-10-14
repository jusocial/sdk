import { PublicKey } from '@solana/web3.js';
import { ProfileArgs } from '@ju-protocol/ju-core';
import {
  ProfileAccount
} from '../accounts';
import { bytesArrToStr } from '../helpers';
import { ProfileJsonMetadata } from './JsonMetadata';
import { assert, Option } from '@/utils';


/** @group Models */
export type Profile<JsonMetadata extends object = ProfileJsonMetadata> = Omit<ProfileArgs, 'firstName' | 'lastName'> & {
  /** A model identifier to distinguish models in the SDK. */
  readonly model: 'profile';

  /** A Public Keys of the Profile */
  readonly address: PublicKey;

  /** The JSON metadata associated with the metadata account. */
  readonly metadata: Option<JsonMetadata>;

  /**  Because `firstName` is byte array in core program - needs to convert to string */
  firstName: string;
  
  /**  Because `lastName` is byte array in core program - needs to convert to string */
  lastName: string;

  /**
   * Whether or not the JSON metadata was loaded in the first place.
   * When this is `false`, the `json` property is should be ignored.
   */
  readonly jsonLoaded: boolean;
}

/** @group Model Helpers */
export const isProfile = (value: any): value is Profile =>
  typeof value === 'object' && value.model === 'metadata';

/** @group Model Helpers */
export function assertProfile(value: any): asserts value is Profile {
  assert(isProfile(value), `Expected Profile model`);
}

/** @group Model Helpers */
export const toProfile = (
  account: ProfileAccount,
  json?: Option<ProfileJsonMetadata>
): Profile => {

  const { firstName, lastName, ...omittedData } = account.data;

  const firstNameAsStr = bytesArrToStr(firstName);
  const lastNameAsStr = bytesArrToStr(lastName);

  const profile:Profile = {
    model: 'profile',
    address: account.publicKey,

    metadata: json ?? null,
    jsonLoaded: json !== undefined,

    firstName: firstNameAsStr,
    lastName: lastNameAsStr,
    
    ...omittedData
  }

  return profile;
};
