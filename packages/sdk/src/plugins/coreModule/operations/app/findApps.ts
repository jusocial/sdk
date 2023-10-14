import type { PublicKey } from '@solana/web3.js';
import { App as AppCore, appDiscriminator } from '@ju-protocol/ju-core';
import { toAppAccount } from '../../accounts';
import { App, AppJsonMetadata, toApp } from '../../models';
import {
  lamports,
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';
import { Option } from '@/utils';

// -----------------
// Operation
// -----------------

const Key = 'FindAppsOperation' as const;

/**
 * Finds all Protocol Applications.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .apps()
 *   .findApps({ authority?: PublicKey };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAppsOperation =
  useOperation<FindAppsOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAppsOperation = Operation<
  typeof Key,
  FindAppsInput,
  FindAppsOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAppsInput = {
  /** The authority of the Application. */
  authority?: PublicKey;

  /**
   * Whether or not we should fetch the JSON Metadata.
   *
   * @defaultValue `false`
   */
  loadJsonMetadata?: boolean;
};

/**
 * @group Operations
 * @category Outputs
 */
export type FindAppsOutput = App[];

/**
 * @group Operations
 * @category Handlers
 */
export const findAppsOperationHandler: OperationHandler<FindAppsOperation> = {
  handle: async (
    operation: FindAppsOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      authority,
      loadJsonMetadata = false
    } = operation.input;

    const builder = AppCore.gpaBuilder();
    // Add discriminator
    builder.addFilter("accountDiscriminator", appDiscriminator);

    // Add additional filters

    if (authority) {
      builder.addFilter("authority", authority);
    }

    const res = await builder.run(ju.connection);
    scope.throwIfCanceled();

    const unparsedAccounts = res.map(({ pubkey, account }) => (
      {
        ...account,
        publicKey: pubkey,
        lamports: lamports(account.lamports),
      }
    ));

    const apps: App[] = [];

    for (const account of unparsedAccounts) {
      try {
        const appAccount = toAppAccount(account);

        // TO-DO: Catching metadata here might be slow, need to find the way...
        const { metadataUri } = appAccount.data;
        let metadataJson: Option<AppJsonMetadata<string>> | undefined = undefined

        if (loadJsonMetadata && metadataUri) {
          try {
            metadataJson = await ju
              .storage()
              .downloadJson<AppJsonMetadata>(metadataUri, scope);
          } catch (error) {
            // TODO
          }
        }

        const app = toApp(
          appAccount,
          metadataJson
        );

        apps.push(app);

      } catch (error) {
        // TODO
      }
    }

    return apps;

  }
};