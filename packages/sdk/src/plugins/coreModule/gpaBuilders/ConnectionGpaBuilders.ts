import {
  connectionDiscriminator,
} from '@ju-protocol/ju-core';
import { PublicKey, PUBLIC_KEY_LENGTH } from '@solana/web3.js';
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

const APP = connectionDiscriminator.length;
const AUTHORITY = APP + PUBLIC_KEY_LENGTH;
const INITIALIZER = AUTHORITY + PUBLIC_KEY_LENGTH;
const TARGET = INITIALIZER + PUBLIC_KEY_LENGTH;
const APPROVED = TARGET + PUBLIC_KEY_LENGTH;

export class ConnectionGpaBuilder extends GpaBuilder {
  whereDiscriminator(discrimator: AccountDiscriminator) {
    return this.where(0, Buffer.from(discrimator));
  }

  connectionAccounts() {
    return this.whereDiscriminator(connectionDiscriminator as AccountDiscriminator);
  }

  connectionAccountsForApp(app: PublicKey) {
    return this.connectionAccounts().where(APP, app.toBase58());
  }

  connectionAccountsForInitializer(initializer: PublicKey) {
    return this.connectionAccounts().where(INITIALIZER, initializer.toBase58());
  }

  connectionAccountsForTarget(target: PublicKey) {
    return this.connectionAccounts().where(TARGET, target.toBase58());
  }

  connectionApprovedAccounts(approved = true) {
    return this.connectionAccounts().where(APPROVED, approved ? 1 : 0);
  }
}


