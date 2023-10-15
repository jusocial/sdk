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

export const bytesArrToStr = (bytes: number[]): string => {
  let result = '';
  for (let i = 0; i < bytes.length; ++i) {
      const byte = bytes[i];
      if (byte === 0) {
          continue; // TODO: Stop if a null byte is encountered ?
      }
      const text = byte.toString(16);
      result += (byte < 16 ? '%0' : '%') + text;
  }
  return decodeURIComponent(result);
};

export const todayToSearchInterval = (eventDays: 1 | 3 ): number => {

  const SECONDS_IN_DAY = 86_400;
  const now = Math.floor(new Date().getTime() / 1000);

  return (now / (eventDays * SECONDS_IN_DAY));
}



