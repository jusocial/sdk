import { Buffer } from 'buffer';
import { PublicKey } from '@solana/web3.js';
import { CoreProgram } from './program';
import { Pda } from '@/types';


/** @group Pdas */
export const findProfilePda = (
  app: PublicKey,
  profile: PublicKey,
  programId: PublicKey = CoreProgram.publicKey
): Pda => {
  return Pda.find(programId, [
    Buffer.from('profile', 'utf8'),
    app.toBuffer(),
    profile.toBuffer()
  ]);
};