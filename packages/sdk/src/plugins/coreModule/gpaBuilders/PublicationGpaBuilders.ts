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
//   + 32                                            // Pubkey (app)
//   + 32                                            // Pubkey (profile)
//   + 32                                            // Pubkey (authority)
//   + (1 + 32)                                      // Option<Pubkey> (subspace)
//   + 1                                             // bool (is_mirror)
//   + 1                                             // bool (is_reply)
//   + (1 + 32)                                      // Option<Pubkey> (target_publication)
//   + 1                                             // bool (is_encrypted)
//   + 1                                             // Enum (content_type)
//   + (1 + STRING_LENGTH_PREFIX + MAX_TAG_LENGTH)   // Option<String> (tag)
//   + (STRING_LENGTH_PREFIX + UUID_LENGTH)          // String (uuid)
//   + (STRING_LENGTH_PREFIX + MAX_URI_LENGTH)       // String      (metadata_uri)                               
//   + (1 + 32)                                      // Option<Pubkey> (collecting_processor)
//   + (1 + 32)                                      // Option<Pubkey> (referencing_processor)
//   + 8                                             // i64 (created_at)
//   + (1 + 8);                                      // Option<i64> (modified_at)

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


const APP_OFFSET = ANCHOR_DISCRIMINATOR_LENGTH;
const PROFILE_OFFSET = APP_OFFSET + PUBLIC_KEY_LENGTH;
const AUTHORITY_OFFSET = PROFILE_OFFSET + PUBLIC_KEY_LENGTH;
const SUBSPACE_OFFSET = OPTION_PREFIX_LENGTH + AUTHORITY_OFFSET + PUBLIC_KEY_LENGTH;
const IS_MIRROR_OFFSET = SUBSPACE_OFFSET + PUBLIC_KEY_LENGTH;
const IS_REPLY_OFFSET = IS_MIRROR_OFFSET +  1;
const TARGET_PUBLICATION_OFFSET = OPTION_PREFIX_LENGTH + IS_REPLY_OFFSET + 1;
const IS_ENCRYPTED_OFFSET = TARGET_PUBLICATION_OFFSET + OPTION_PREFIX_LENGTH + PUBLIC_KEY_LENGTH;
const CONTENT_TYPE_OFFSET =  IS_ENCRYPTED_OFFSET + 1;
const TAG_OFFSET = CONTENT_TYPE_OFFSET + 1;

export class PublicationGpaBuilder extends GpaBuilder {

  selectAll() {
    return this.where(0, Buffer.from(publicationDiscriminator as AccountDiscriminator));
  }

  selectByApp(app: PublicKey) {
    return this.where(APP_OFFSET, app);
  }

  selectByProfile(profile: PublicKey) {
    return this.where(PROFILE_OFFSET, profile);
  }

  selectBySubspace(subspace: PublicKey) {
    return this.where(SUBSPACE_OFFSET, subspace);
  }

  selectByIsMirror(isMirror: boolean) {
    return this.where(IS_MIRROR_OFFSET, isMirror);
  }

  selectByByIsReply(isReply: boolean) {
    return this.where(IS_REPLY_OFFSET, isReply);
  }

  selectByTarget(target: PublicKey) {
    // const concatBuffer = Buffer.concat([Buffer.from([1]), target.toBuffer()], 33);
    // const needle = base58.encode(concatBuffer);

    // console.log('concatBuffer :>> ', concatBuffer);
    // console.log('needle :>> ', needle);

    return this.where(TARGET_PUBLICATION_OFFSET, target);
  }

  selectByIsEncrypted(isEncripted: boolean) {
    return this.where(IS_ENCRYPTED_OFFSET, isEncripted);
  }

  selectByContentType(contentType: ContentType) {
    return this.where(TARGET_PUBLICATION_OFFSET, contentType);
  }

  selectByTag(tag: string) {
    return this.where(TAG_OFFSET, tag);
  }

}


