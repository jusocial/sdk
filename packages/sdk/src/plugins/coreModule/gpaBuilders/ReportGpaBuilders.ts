import {
  reportDiscriminator,
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

const APP = reportDiscriminator.length;
const AUTHORITY = APP + PUBLIC_KEY_LENGTH;
const INITIALIZER = AUTHORITY + PUBLIC_KEY_LENGTH;
const TARGET = INITIALIZER + PUBLIC_KEY_LENGTH;
// const REPORT_TYPE = TARGET + 1;

export class ReportGpaBuilder extends GpaBuilder {
  whereDiscriminator(discrimator: AccountDiscriminator) {
    return this.where(0, Buffer.from(discrimator));
  }

  reportAccounts() {
    return this.whereDiscriminator(reportDiscriminator as AccountDiscriminator);
  }

  reportAccountsForApp(app: PublicKey) {
    return this.reportAccounts().where(APP, app.toBase58());
  }

  reportAccountsForInitializer(initializer: PublicKey) {
    return this.reportAccounts().where(INITIALIZER, initializer.toBase58());
  }

  reportAccountsForTarget(target: PublicKey) {
    return this.reportAccounts().where(TARGET, target.toBase58());
  }
}


