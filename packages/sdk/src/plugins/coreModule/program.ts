import { PROGRAM_ID } from '@ju-protocol/ju-core';
import { Ju } from '@/Ju';
import { 
  AppGpaBuilder,
  ProfileGpaBuilder,
  SubspaceGpaBuilder,
  PublicationGpaBuilder,
} from './gpaBuilders';

/** @group Programs */
export const CoreProgram = {
  publicKey: PROGRAM_ID,

  appAccounts(ju: Ju) {
    return new AppGpaBuilder(ju, this.publicKey);
  },

  profileAccounts(ju: Ju) {
    return new ProfileGpaBuilder(ju, this.publicKey);
  },

  subspaceAccounts(ju: Ju) {
    return new SubspaceGpaBuilder(ju, this.publicKey);
  },

  publicationAccounts(ju: Ju) {
    return new PublicationGpaBuilder(ju, this.publicKey);
  },
};