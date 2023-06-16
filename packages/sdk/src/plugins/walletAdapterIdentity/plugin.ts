import {
  WalletAdapterIdentityDriver,
  WalletAdapter,
} from './WalletAdapterIdentityDriver';
import { Ju } from '@/Ju';
import { JuPlugin } from '@/types';

export const walletAdapterIdentity = (
  walletAdapter: WalletAdapter
): JuPlugin => ({
  install(ju: Ju) {
    ju
      .identity()
      .setDriver(new WalletAdapterIdentityDriver(walletAdapter));
  },
});
