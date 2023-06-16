// import { Profile } from './models';
// import {
//   ProfileNotFoundError,
// } from './errors';
import { MAX_APP_NAME_LENGTH } from './constants';
import { assert } from '@/utils';
// import { BigNumber, now, Signer, toBigNumber } from '@/types';

export const assertAppName = (name: string) => {
  assert(
    name.length <= MAX_APP_NAME_LENGTH,
    `App name too long: ${name} (max ${MAX_APP_NAME_LENGTH})`
  );
};

// export const assertAuthority = (authority: PublicKey) => {
//   assert(
//     name.length <= MAX_APP_NAME_LENGTH,
//     `App name too long: ${name} (max ${MAX_APP_NAME_LENGTH})`
//   );
// };
