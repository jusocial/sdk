import type { PublicKey } from '@solana/web3.js';
import { toAppAccount } from '../../accounts';
import { App, toApp } from '../../models/App';
import { AppJsonMetadata } from '../../models';
import {
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';

// -----------------
// Operation
// -----------------

const Key = 'FindAppByAddressOperation' as const;

/**
 * Finds an App by its address.
 *
 * ```ts
 * const app = await ju
 *   .core()
 *   .findAppByAddress(
 *      { 
 *        address: JP8sM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUQgT,
 *        loadJsonMetadata: true
 *      }
 *    );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAppByAddressOperation =
  useOperation<FindAppByAddressOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAppByAddressOperation = Operation<
  typeof Key,
  FindAppByAddressInput,
  App
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAppByAddressInput = {
  /** The address of the App. */
  address: PublicKey;

  /**
   * Whether or not we should fetch the JSON Metadata.
   *
   * @defaultValue `true`
   */
  loadJsonMetadata?: boolean;
};

/**
 * @group Operations
 * @category Handlers
 */
export const findAppByAddressOperationHandler: OperationHandler<FindAppByAddressOperation> =
{
  handle: async (
    operation: FindAppByAddressOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    const { commitment } = scope;
    const {
      address,
      loadJsonMetadata = true
    } = operation.input;

    const account = await ju
      .rpc()
      .getAccount(address, commitment);
    scope.throwIfCanceled();

    if (!account.exists) {
      // TO-DO
      throw Error('App not found');
      // return null;
    }

    const appAccount = toAppAccount(account);

    let metadataJson: AppJsonMetadata<string> = {}
    if (loadJsonMetadata && appAccount.data.metadataUri) {
      try {
        metadataJson = await ju
          .storage()
          .downloadJson<AppJsonMetadata>(appAccount.data.metadataUri, scope);
      } catch (error) {
        // TO-DO
      }
    }

    // if (appAccount.data.authority.toBase58() === ju.identity().publicKey.toBase58()) {
    //   return new AppAdmin(
    //     ju,
    //     appAccount,
    //     metadataJson
    //   );
    // }

    return toApp(
      appAccount,
      metadataJson
    );

  }

};