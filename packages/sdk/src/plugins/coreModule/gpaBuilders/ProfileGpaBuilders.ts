import {
  profileDiscriminator,
} from '@ju-protocol/ju-core';
import { PublicKey } from '@solana/web3.js';
import { GpaBuilder } from '@/utils';

type AccountDiscriminator = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

const APP = profileDiscriminator.length;

export class ProfileGpaBuilder extends GpaBuilder {
  whereDiscriminator(discrimator: AccountDiscriminator) {
    return this.where(0, Buffer.from(discrimator));
  }

  profileAccounts() {
    return this.whereDiscriminator(profileDiscriminator as AccountDiscriminator);
  }

  profileAccountsForApp(app: PublicKey) {
    return this.profileAccounts().where(APP, app.toBase58());
  }
}


