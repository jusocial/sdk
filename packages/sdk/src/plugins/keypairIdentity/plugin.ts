import { Keypair } from '@solana/web3.js';
import { KeypairIdentityDriver } from './KeypairIdentityDriver';
import { Ju } from '@/Ju';
import { JuPlugin } from '@/types';

export const keypairIdentity = (keypair: Keypair): JuPlugin => ({
  install(ju: Ju) {
    ju.identity().setDriver(new KeypairIdentityDriver(keypair));
  },
});
