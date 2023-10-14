import {
  ContentType,
  publicationDiscriminator,
} from '@ju-protocol/ju-core';
import { PublicKey, PUBLIC_KEY_LENGTH } from '@solana/web3.js';
import { ANCHOR_DISCRIMINATOR_LENGTH, OPTION_PREFIX_LENGTH } from '../constants';
import { GpaBuilder } from '@/utils';
// import base58 from 'bs58';


// From core program:
// pub const LEN: usize = DISCRIMINATOR_LENGTH         // Anchor internal discrimitator    
// + 8                                             // i64 (`created_at`) 
// + 32                                            // Pubkey (`app`)
// + 32                                            // Pubkey (`profile`)
// + 32                                            // Pubkey (`authority`)
// + 1                                             // bool (`is_encrypted`)
// + 1                                             // bool (`is_mirror`)
// + 1                                             // bool (`is_reply`)
// + 1                                             // Enum (`content_type`) 
// + (MAX_TAG_LENGTH)                              // [u8; MAX_TAG_LENGTH] (`tag`)
// + 32                                            // Pubkey (`target_publication`)
// + (1 + 32)                                      // Option<Pubkey> (`subspace`) 
// + (STRING_LENGTH_PREFIX + UUID_LENGTH)          // String (`uuid`)
// + (STRING_LENGTH_PREFIX + MAX_URI_LENGTH)       // String (`metadata_uri`)                               
// + (1 + 32)                                      // Option<Pubkey> (`collecting_processor`)
// + (1 + 32)                                      // Option<Pubkey> (`referencing_processor`)    
// + (1 + 8);                                      // Option<i64> (`modified_at`)

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

const CREATED_OFFSET = ANCHOR_DISCRIMINATOR_LENGTH;
const APP_OFFSET = CREATED_OFFSET + 8;
const PROFILE_OFFSET = APP_OFFSET + PUBLIC_KEY_LENGTH;
const AUTHORITY_OFFSET = PROFILE_OFFSET + PUBLIC_KEY_LENGTH;

const IS_ENCRYPTED_OFFSET = AUTHORITY_OFFSET + PUBLIC_KEY_LENGTH;
const IS_MIRROR_OFFSET = IS_ENCRYPTED_OFFSET + 1;
const IS_REPLY_OFFSET = IS_MIRROR_OFFSET + 1;

const CONTENT_TYPE_OFFSET =  IS_REPLY_OFFSET + 1;
const TAG_OFFSET = CONTENT_TYPE_OFFSET + 1;
const TARGET_PUBLICATION_OFFSET = TAG_OFFSET + 1;

const SUBSPACE_OFFSET = OPTION_PREFIX_LENGTH + TARGET_PUBLICATION_OFFSET + PUBLIC_KEY_LENGTH;


export class PublicationGpaBuilder extends GpaBuilder {

  all() {
    return this.where(0, Buffer.from(publicationDiscriminator as AccountDiscriminator));
  }

  whereApp(app: PublicKey) {
    return this.where(APP_OFFSET, app);
  }

  whereProfile(profile: PublicKey) {
    return this.where(PROFILE_OFFSET, profile);
  }

  whereSubspace(subspace: PublicKey) {
    return this.where(SUBSPACE_OFFSET, subspace);
  }

  whereIsMirror(isMirror: boolean) {
    return this.where(IS_MIRROR_OFFSET, isMirror);
  }

  whereIsReply(isReply: boolean) {
    return this.where(IS_REPLY_OFFSET, isReply);
  }

  whereTarget(target: PublicKey) {
    return this.where(TARGET_PUBLICATION_OFFSET, target);
  }

  whereIsEncrypted(isEncripted: boolean) {
    return this.where(IS_ENCRYPTED_OFFSET, isEncripted);
  }

  whereContentType(contentType: ContentType) {
    return this.where(TARGET_PUBLICATION_OFFSET, contentType);
  }

  whereTag(tag: string) {
    return this.where(TAG_OFFSET, tag);
  }

  whereCreated(created: number) {
    return this.where(TAG_OFFSET, created);
  }

}


