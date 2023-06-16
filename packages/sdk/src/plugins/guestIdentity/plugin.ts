import { PublicKey } from '@solana/web3.js';
import { GuestIdentityDriver } from './GuestIdentityDriver';
import { Ju } from '@/Ju';
import { JuPlugin } from '@/types';

/** @group Plugins */
export const guestIdentity = (publicKey?: PublicKey): JuPlugin => ({
  install(ju: Ju) {
    ju.identity().setDriver(new GuestIdentityDriver(publicKey));
  },
});
