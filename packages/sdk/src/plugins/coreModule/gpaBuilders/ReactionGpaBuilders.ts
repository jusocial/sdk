import {
  reactionDiscriminator,
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

const APP = reactionDiscriminator.length;
const AUTHORITY = APP + PUBLIC_KEY_LENGTH;
const INITIALIZER = AUTHORITY + PUBLIC_KEY_LENGTH;
const TARGET = INITIALIZER + PUBLIC_KEY_LENGTH;
// const REACTION_TYPE = TARGET + 1;

export class ReactionGpaBuilder extends GpaBuilder {
  whereDiscriminator(discrimator: AccountDiscriminator) {
    return this.where(0, Buffer.from(discrimator));
  }

  reactionAccounts() {
    return this.whereDiscriminator(reactionDiscriminator as AccountDiscriminator);
  }

  reactionAccountsForApp(app: PublicKey) {
    return this.reactionAccounts().where(APP, app.toBase58());
  }

  reactionAccountsForInitializer(initializer: PublicKey) {
    return this.reactionAccounts().where(INITIALIZER, initializer.toBase58());
  }

  reactionAccountsForTarget(target: PublicKey) {
    return this.reactionAccounts().where(TARGET, target.toBase58());
  }
}


