import { 
  publicationDiscriminator,
} from '@ju-protocol/ju-core';
import { PublicKey, PUBLIC_KEY_LENGTH } from '@solana/web3.js';
import { GpaBuilder } from '@/utils';
import { MAX_URI_LENGTH, UUID_LENGTH } from '../constants';

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

const UUID = publicationDiscriminator.length;
const APP = UUID + UUID_LENGTH;
const PROFILE = APP + PUBLIC_KEY_LENGTH;
const AUTHORITY = PROFILE + PUBLIC_KEY_LENGTH;
const METADATA_URI = AUTHORITY + MAX_URI_LENGTH;
const SUBSPACE = METADATA_URI + PUBLIC_KEY_LENGTH;
const IS_MIRROR = SUBSPACE + 1;
const IS_REPLY = IS_MIRROR + 1;
const TARGET = IS_REPLY + PUBLIC_KEY_LENGTH;

export class PublicationGpaBuilder extends GpaBuilder {
  whereDiscriminator(discrimator: AccountDiscriminator) {
    return this.where(0, Buffer.from(discrimator));
  }

  publicationAccounts() {
    return this.whereDiscriminator(publicationDiscriminator as AccountDiscriminator);
  }

  publicationAccountsForUUID(uuid: PublicKey) {
    return this.publicationAccounts().where(UUID, uuid.toBase58());
  }

  publicationAccountsForApp(app: PublicKey) {
    return this.publicationAccounts().where(APP, app.toBase58());
  }

  publicationAccountsForProfile(profile: PublicKey) {
    return this.publicationAccounts().where(PROFILE, profile.toBase58());
  }

  publicationAccountsForSubspace(publication: PublicKey) {
    return this.publicationAccounts().where(SUBSPACE, publication.toBase58());
  }

  publicationAccountsForTarget(target: PublicKey) {
    return this.publicationAccounts().where(TARGET, target.toBase58());
  }

  publicationMirrorAccounts() {
    return this.publicationAccounts().where(IS_MIRROR, 1);
  }

  publicationReplyAccounts() {
    return this.publicationAccounts().where(IS_REPLY, 0);
  }
}


