import type { PublicKey } from '@solana/web3.js';
import { toSubspaceAccount } from '../../accounts';
import { Subspace, toSubspace } from '../../models/Subspace';
import { SubspaceJsonMetadata } from '../../models';
import {
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';

/**
 * @import {type} {OtherModuleOutputType} from 'otherModule'
 */

// -----------------
// Operation
// -----------------

const Key = 'FindSubspaceByAddressOperation' as const;

/**
 * Finds an Subspace by its address.
 *
 * ```ts
 * const subspace = await ju
 *   .core()
 *   .findSubspaceByAddress(
 *      { 
 *        subspace: JP8sM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUQgT,
 *        loadJsonMetadata: true
 *      }
 *    );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findSubspaceByAddressOperation =
  useOperation<FindSubspaceByAddressOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindSubspaceByAddressOperation = Operation<
  typeof Key,
  FindSubspaceByAddressInput,
  Subspace
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindSubspaceByAddressInput = {
  /** The address of the Subspace. */
  subspace: PublicKey;

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
export const findSubspaceByAddressOperationHandler: OperationHandler<FindSubspaceByAddressOperation> =
{
  handle: async (
    operation: FindSubspaceByAddressOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    const { commitment } = scope;
    const { 
      subspace,
      loadJsonMetadata = true
    } = operation.input;

    const account = await ju
      .rpc()
      .getAccount(subspace, commitment);
    scope.throwIfCanceled();

    if (!account.exists) {
      // TO-DO
      throw Error('Subspace not found');
      // return null;
    }

    const subspaceAccount = toSubspaceAccount(account);

    const {metadataUri} = subspaceAccount.data;
    let metadataJson: SubspaceJsonMetadata<string> = {}
    if (loadJsonMetadata && metadataUri) {
      try {
        metadataJson = await ju
          .storage()
          .downloadJson<SubspaceJsonMetadata>(metadataUri, scope);
      } catch (error) {
        // TO-DO
      }
    }

    // if (subspaceAccount.data.authority.toBase58() === ju.identity().publicKey.toBase58()) {
    //   return new SubspaceAdmin(
    //     ju,
    //     subspaceAccount,
    //     metadataJson
    //   );
    // }

    return toSubspace(
      subspaceAccount,
      metadataJson
    );
  },
};