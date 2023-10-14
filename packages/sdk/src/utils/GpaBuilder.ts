import { Buffer } from 'buffer';
import {
  GetProgramAccountsConfig,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js';
import base58 from 'bs58';
import BN from 'bn.js';
import { GmaBuilder, GmaBuilderOptions } from './GmaBuilder';
import { Ju } from '@/Ju';
import { UnparsedAccount } from '@/types';

export type GpaSortCallback = (
  a: UnparsedAccount,
  b: UnparsedAccount
) => number;

export class GpaBuilder {
  /** The connection instance to use when fetching accounts. */
  protected readonly ju: Ju;

  /** The public key of the program we want to retrieve accounts from. */
  protected readonly programId: PublicKey;

  /** The configs to use when fetching program accounts. */
  protected config: GetProgramAccountsConfig = {};

  /** When provided, reorder accounts using this callback. */
  protected sortCallback?: GpaSortCallback;

  constructor(ju: Ju, programId: PublicKey) {
    this.ju = ju;
    this.programId = programId;
  }

  mergeConfig(config: GetProgramAccountsConfig) {
    this.config = { ...this.config, ...config };

    return this;
  }

  slice(offset: number, length: number) {
    this.config.dataSlice = { offset, length };

    return this;
  }

  withoutData() {
    return this.slice(0, 0);
  }

  addFilter(...filters: GetProgramAccountsFilter[]) {
    if (!this.config.filters) {
      this.config.filters = [];
    }

    this.config.filters.push(...filters);

    console.log('filters :>> ', this.config.filters);
    
    return this;
  }

  where(offset: number, bytes: string | Buffer | PublicKey | BN | number | boolean) {
    if (Buffer.isBuffer(bytes)) {
      bytes = base58.encode(bytes);
    } else if (typeof bytes === 'object' && 'toBase58' in bytes) {
      bytes = bytes.toBase58();
    } else if (BN.isBN(bytes)) {
      bytes = base58.encode(bytes.toArray());
    } else if (typeof bytes === 'boolean') {
      bytes = bytes === true ? '2' : '1';
    } else if (typeof bytes !== 'string') {
      bytes = base58.encode(new BN(bytes, 'le').toArray());
    }

    return this.addFilter({ memcmp: { offset, bytes } });
  }

  whereSize(dataSize: number) {
    return this.addFilter({ dataSize });
  }

  sortUsing(callback: GpaSortCallback) {
    this.sortCallback = callback;

    return this;
  }

  async get(): Promise<UnparsedAccount[]> {
    const accounts = await this.ju
      .rpc()
      .getProgramAccounts(this.programId, this.config);

    if (this.sortCallback) {
      accounts.sort(this.sortCallback);
    }

    return accounts;
  }

  async getAndMap<T>(callback: (account: UnparsedAccount) => T): Promise<T[]> {
    return (await this.get()).map(callback);
  }

  async getPublicKeys(): Promise<PublicKey[]> {
    return this.getAndMap((account) => account.publicKey);
  }

  async getDataAsPublicKeys(): Promise<PublicKey[]> {
    // TODO(loris): Throw a custom Ju error if the data is not a public key.
    return this.getAndMap((account) => new PublicKey(account.data));
  }

  async getMultipleAccounts(
    callback?: (account: UnparsedAccount) => PublicKey,
    options?: GmaBuilderOptions
  ): Promise<GmaBuilder> {
    // TODO(loris): Throw a custom Ju error if the data is not a public key.
    const cb = callback ?? ((account) => new PublicKey(account.data));

    return new GmaBuilder(this.ju, await this.getAndMap(cb), options);
  }

}
