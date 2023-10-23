import { Buffer } from 'buffer';
import type { Ju } from '@/Ju';
import { Pda, Program, PublicKey, toPublicKey } from '@/types';
// import { Option } from '@/utils';

/**
 * This client allows you to build PDAs related to the Core module.
 *
 * @see {@link CoreClient}
 * @group Module Pdas
 */
export class CorePdasClient {
  constructor(protected readonly ju: Ju) {}

  /** Finds the Protocol Developer whitelist item. */
  developer(input: {
    /** Developer authority */
    authority?: PublicKey
    /** An optional set of programs that override the registered ones. */
    programs?: Program[];
  }): Pda {
    const authority = input.authority || this.ju.identity().publicKey;
    const programId = this.programId(input.programs);
    return Pda.find(programId, [
      Buffer.from('developer', 'utf8'),
      authority.toBuffer(),
    ]);
  }

  /** Finds the JXP whitelist item. */
  processor(input: {
    /** Developer authority */
    program: PublicKey
    /** An optional set of programs that override the registered ones. */
    programs?: Program[];
  }): Pda {
    const programId = this.programId(input.programs);
    return Pda.find(programId, [
      Buffer.from('processor', 'utf8'),
      input.program.toBuffer(),
    ]);
  }

  /** Finds the protocol Application. */
  app(input: {
    /** Applications name */
    appDomainName: string;
    /** An optional set of programs that override the registered ones. */
    programs?: Program[];
  }): Pda {
    const programId = this.programId(input.programs);
    return Pda.find(programId, [
      Buffer.from('app', 'utf8'),
      Buffer.from(input.appDomainName, 'utf8'),
    ]);
  }
 
  /** Finds the Application's Profile PDA. */
  profile(input: {
    /** The address of the App. */
    app: PublicKey
    /** The address of the Profile's creator. */
    authority?: PublicKey;
    /** An optional set of programs that override the registered ones. */
    programs?: Program[];
  }): Pda {
    const programId = this.programId(input.programs);
    if (!input.authority) {
      input.authority = toPublicKey(this.ju.identity());
    }
    return Pda.find(programId, [
      Buffer.from('profile', 'utf8'),
      input.app.toBuffer(),
      input.authority.toBuffer(),
    ]);
  }

  /** Finds the Application's Profile Alias. */
  alias(input: {
    /** The address of the App. */
    app: PublicKey
    /** Alias to be registered . */
    alias: string;
    /** An optional set of programs that override the registered ones. */
    programs?: Program[];
  }): Pda {
    const programId = this.programId(input.programs);
    return Pda.find(programId, [
      Buffer.from('alias', 'utf8'),
      input.app.toBuffer(),
      Buffer.from(input.alias, 'utf8'),
    ]);
  }

  /** Finds the Profiles Connection. */
  connection(input: {
    /** The address of the App. */
    app: PublicKey
    /** Connection initializer's Pubkey. */
    initializer: PublicKey;
    /** Connection target Pubkey. */
    target: PublicKey;
    /** An optional set of programs that override the registered ones. */
    programs?: Program[];
  }): Pda {
    const programId = this.programId(input.programs);
    return Pda.find(programId, [
      Buffer.from('connection', 'utf8'),
      input.app.toBuffer(),
      input.initializer.toBuffer(),
      input.target.toBuffer(),
      input.initializer.toBuffer(),  // Second time!
    ]);
  }

  /** Finds the Profiles Connection. */
  subspace(input: {
    /** The address of the App. */
    app: PublicKey
    /** Subspace creator Profile (Pubkey). */
    creator: PublicKey;
    /** The UUID of the Subspace. */
    uuid: string;
    /** An optional set of programs that override the registered ones. */
    programs?: Program[];
  }): Pda {
    const programId = this.programId(input.programs);
    return Pda.find(programId, [
      Buffer.from('subspace', 'utf8'),
      input.app.toBuffer(),
      input.creator.toBuffer(),
      Buffer.from(input.uuid, 'utf8'),
    ]);
  }

  /** Finds the Subspace Manager whitelist item. */
  subspaceManager(input: {
    /** The address of the Subspace. */
    subspace: PublicKey
    /** Profile to add as Managet(Pubkey). */
    profile: PublicKey;
    /** An optional set of programs that override the registered ones. */
    programs?: Program[];
  }): Pda {
    const programId = this.programId(input.programs);
    return Pda.find(programId, [
      Buffer.from('subspace_manager', 'utf8'),
      input.subspace.toBuffer(),
      input.profile.toBuffer(),
    ]);
  }

  /** Finds the Application's Publication. */
  publication(input: {
    /** The address of the App. */
    app: PublicKey
    /** The UUID of the Publicationstring. */
    uuid: string;
    /** An optional set of programs that override the registered ones. */
    programs?: Program[];
  }): Pda {
    const programId = this.programId(input.programs);
    return Pda.find(programId, [
      Buffer.from('publication', 'utf8'),
      input.app.toBuffer(),
      Buffer.from(input.uuid, 'utf8'),
    ]);
  }

  /** Finds the Application's Publication. */
  collectionItem(input: {
    /** The address of the App. */
    app: PublicKey
    /** The target Publication to collect. */
    target: PublicKey;
    /** An optional set of programs that override the registered ones. */
    programs?: Program[];
  }): Pda {
    const programId = this.programId(input.programs);
    return Pda.find(programId, [
      Buffer.from('collection_item', 'utf8'),
      input.app.toBuffer(),
      input.target.toBuffer(),
    ]);
  }

  /** Finds the Application's Reaction. */
  reaction(input: {
    /** The address of the App. */
    app: PublicKey
    /** Reaction target Pubkey. */
    target: PublicKey;
    /** Reaction initializer's Pubkey. */
    initializer: PublicKey;
    /** An optional set of programs that override the registered ones. */
    programs?: Program[];
  }): Pda {
    const programId = this.programId(input.programs);
    return Pda.find(programId, [
      Buffer.from('reaction', 'utf8'),
      input.app.toBuffer(),
      input.target.toBuffer(),
      input.initializer.toBuffer()
    ]);
  }

  /** Finds the Application's Report. */
  report(input: {
    /** The address of the App. */
    app: PublicKey
    /** Report target Pubkey. */
    target: PublicKey;
    /** Report initializer's Pubkey. */
    initializer: PublicKey;
    /** An optional set of programs that override the registered ones. */
    programs?: Program[];
  }): Pda {
    const programId = this.programId(input.programs);
    return Pda.find(programId, [
      Buffer.from('report', 'utf8'),
      input.app.toBuffer(),
      input.target.toBuffer(),
      input.initializer.toBuffer()
    ]);
  }

  private programId(programs?: Program[]) {
    return this.ju.programs().getJuCore(programs).address;
  }
}