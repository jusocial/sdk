import { PublicKey } from '@solana/web3.js';
import {
  ReportArgs,
} from '@ju-protocol/ju-core';
import {
  ReportAccount
} from '../accounts';
import { assert } from '@/utils';
// import { Ju } from '@/Ju';


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



// /**
//  * Represents a Report in the SDK.
//  */
// export class Report {
//   /**
//    * A model identifier to distinguish models in the SDK.
//    */
//   static readonly model = 'Report';

//   /**
//    * The Ju instance.
//    */
//   readonly ju: Ju;

//   /**
//    * The Report address.
//    */
//   readonly address: PublicKey;

//   /**
//    * The Report data.
//    */
//   readonly data: ReportArgs;

//   /**
//    * Creates an instance of Report.
//    * @param {Ju} ju - The Ju instance.
//    * @param {ReportAccount} reportAccount - The Report account.
//    * @param {Option<ReportJsonMetadata>} [json] - The JSON metadata associated with the Report account.
//    */
//   constructor(
//     ju: Ju,
//     reportAccount: ReportAccount,
//   ) {
//     this.ju = ju;
//     this.address = reportAccount.publicKey;
//     this.data = reportAccount.data;
//   }

//   /**
//    * Checks if a value is an instance of Report.
//    * @param {*} value - The value to check.
//    * @returns {boolean} `true` if the value is an instance of Report, `false` otherwise.
//    */
//   static isReport(value: any): value is Report {
//     return typeof value === 'object' && value.model === 'Report';
//   }

//   /**
//    * Asserts that a value is an instance of Report.
//    * @param {*} value - The value to assert.
//    * @throws {Error} If the value is not an instance of Report.
//    */
//   static assertReport(value: any): asserts value is Report {
//     assert(this.isReport(value), 'Expected Report type');
//   }
// }