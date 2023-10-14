import { PublicKey } from '@solana/web3.js';
import { ReportArgs } from '@ju-protocol/ju-core';
import {
  ReportAccount
} from '../accounts';
import { assert } from '@/utils';


/** @group Models */
export type Report = ReportArgs & {
  /** A model identifier to distinguish models in the SDK. */
  readonly model: 'profile';

  /** A Public Keys of the Report */
  readonly address: PublicKey;
}

/** @group Model Helpers */
export const isReport = (value: any): value is Report =>
  typeof value === 'object' && value.model === 'metadata';

/** @group Model Helpers */
export function assertReport(value: any): asserts value is Report {
  assert(isReport(value), `Expected Report model`);
}

/** @group Model Helpers */
export const toReport = (
  account: ReportAccount
): Report => ({
  model: 'profile',
  address: account.publicKey,
  
  ...account.data
});