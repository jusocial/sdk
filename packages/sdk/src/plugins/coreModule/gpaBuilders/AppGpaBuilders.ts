import {
  appDiscriminator,
} from '@ju-protocol/ju-core';
import { PublicKey } from '@solana/web3.js';
import { GpaBuilder } from '@/utils';

const APP = appDiscriminator.length;

export class AppGpaBuilder extends GpaBuilder {
  appAccounts() {
    return this.where(0, Buffer.from(appDiscriminator));
  }

  appAccountsByAuthority(authority: PublicKey) {
    return this.appAccounts().where(APP, authority.toBase58());
  }
}


