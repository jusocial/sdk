import type { PublicKey } from '@solana/web3.js';
import { Subspace as SubspaceCore, subspaceDiscriminator } from '@ju-protocol/ju-core'
import { toSubspaceAccount } from '../../accounts';
import { Subspace, SubspaceJsonMetadata, toSubspace } from '../../models';
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

const Key = 'FindSubspacesOperation' as const;

/**
 * Finds Subspaces by filters
 *
 * ```ts
 * const subspaceKeys = await ju
 *   .core()
 *   .subspaces(app)
 *   .findSubspaces();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findSubspacesOperation =
  useOperation<FindSubspacesOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindSubspacesOperation = Operation<
  typeof Key,
  FindSubspacesInput,
  Subspace[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindSubspacesInput = {
  /** The app address of the Subspace. */
  app?: PublicKey;

  /** The authority of the Subspace. */
  authority?: PublicKey;

  /** The creator of the Subspace. */
  creator?: PublicKey;

  /**
   * Whether or not we should fetch the JSON Metadata.
   *
   * @defaultValue `false`
   */
  loadJsonMetadata?: boolean;
};

/**
 * @group Operations
 * @category Handlers
 */
export const findSubspacesOperationHandler: OperationHandler<FindSubspacesOperation> =
{
  handle: async (
    operation: FindSubspacesOperation,
    ju: Ju,
    scope: OperationScope
  ) => {

    // const { commitment } = scope;

    const {
      app,
      authority,
      creator,
      loadJsonMetadata = false
    } = operation.input;

    const builder = SubspaceCore.gpaBuilder();

    // Add discriminator
    builder.addFilter("accountDiscriminator", subspaceDiscriminator);

    // Add additional filters
    if (app) {
      builder.addFilter("app", app)
    }
    if (authority) {
      builder.addFilter("authority", authority)
    }
    if (creator) {
      builder.addFilter("creator", creator)
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

    const subspaces: Subspace[] = [];

    for (const account of unparsedAccounts) {
      try {
        const subspaceAccount = toSubspaceAccount(account);

        // TO-DO: Catching metadata here might be slow, need to find the way...
        const { metadataUri } = subspaceAccount.data;
        let metadataJson: Option<SubspaceJsonMetadata<string>> | undefined = undefined

        if (loadJsonMetadata && metadataUri) {
          try {
            metadataJson = await ju
              .storage()
              .downloadJson<SubspaceJsonMetadata>(metadataUri, scope);
          } catch (error) {
            // TODO
          }
        }

        const subspace = toSubspace(
          subspaceAccount,
          metadataJson
        );

        subspaces.push(subspace);

      } catch (error) {
        // TODO
      }
    }

    return subspaces;
  },
};