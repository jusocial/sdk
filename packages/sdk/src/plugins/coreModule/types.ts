import { AppArgs } from '@ju-protocol/ju-core'
import { PublicKey } from '@solana/web3.js';
import { Option } from '@/utils'

export type InstructionData<T> = { appId: PublicKey } & T

export type AppInput = Omit<AppArgs, 'authority'>;

export type ExternalProcessors = {
  /** Registering Processor PDA address. */
  registeringProcessor: Option<PublicKey>;

  /** Connecting Processor PDA address. */
  connectingProcessor: Option<PublicKey>;

  /** Publishing Processor PDA address. */
  publishingProcessor: Option<PublicKey>;

  /** Collecting Processor PDA address. */
  collectingProcessor: Option<PublicKey>;

  /** Referencing Processor PDA address. */
  referencingProcessor: Option<PublicKey>;
}