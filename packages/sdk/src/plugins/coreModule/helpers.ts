import { PublicKey } from '@solana/web3.js';
import { Profile, ProfileArgs, PROGRAM_ID } from '@ju-protocol/ju-core';
import * as uuid from 'uuid';
import BN from 'bn.js';
import { Option } from '@/utils'
import { toPublicKey } from '@/types';

export function getProfileAccountSizeFromData(data: ProfileArgs) {
  return Profile.byteSize(data);
}

// export const getProfileUuidFromAddress = (
//   profileAddress: PublicKey
// ): string => {
//   return profileAddress.toBase58().slice(0, 6);
// };


export const toOptionalAccount = (
  account?: PublicKey | Option<PublicKey>
): PublicKey => {
  // Return account or PROGRAM_ID
  return account ? account : toPublicKey(PROGRAM_ID);
};

export const generateUuid = (): string => {
  return uuid.v4().replace(/-/g, '');
};


export const isPda = (addr: string): boolean => {
  let publicKey: PublicKey;
  try {
    publicKey = new PublicKey(addr);

    return !PublicKey.isOnCurve(publicKey.toBytes());

  } catch (err) {
    return false;
  }

  return false;
};

export const toBirthDate = (year: number, month: number, day: number) => {
  const birthDate = new Date(year, month, day);
  const unixTimestamp = Math.floor(birthDate.getTime() / 1000).toString();
  return new BN(unixTimestamp);
}



