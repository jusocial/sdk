import { 
  subspaceDiscriminator,
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

const APP = subspaceDiscriminator.length;
// const APP = UUID + 36;  // UUID length = 4 + 32

export class SubspaceGpaBuilder extends GpaBuilder {
  whereDiscriminator(discrimator: AccountDiscriminator) {
    return this.where(0, Buffer.from(discrimator));
  }

  subspaceAccounts() {
    return this.whereDiscriminator(subspaceDiscriminator as AccountDiscriminator);
  }

  subspaceAccountsForApp(app: PublicKey) {
    return this.subspaceAccounts().where(APP, app.toBase58());
  }
}


