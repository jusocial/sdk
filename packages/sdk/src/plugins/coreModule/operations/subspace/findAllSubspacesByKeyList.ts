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
import { GmaBuilder, Option } from '@/utils';

// -----------------
// Operation
// -----------------

const Key = 'FindAllSubspacesByKeyListOperation' as const;

/**
 * Finds all Subspaces data for specified pubkey list.
 *
 * ```ts
 * const subspaces = await ju
 *   .core()
 *   .findAllSubspacesByKeyList({ addressList };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAllSubspacesByKeyListOperation =
  useOperation<FindAllSubspacesByKeyListOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAllSubspacesByKeyListOperation = Operation<
  typeof Key,
  FindAllSubspacesByKeyListInput,
  Subspace[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAllSubspacesByKeyListInput = {
  /** Subspaces as Public keys array */
  keys: PublicKey[];

  /**
   * Whether or not we should fetch the JSON Metadata.
   *
   * @defaultValue `true`
   */
  loadJsonMetadata?: boolean;

  /** Chunk size */
  chunkSize?: number | undefined;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindAllSubspacesByKeyListOutput = Subspace [];

/**
 * @group Operations
 * @category Handlers
 */
export const findAllSubspacesByKeyListOperationHandler: OperationHandler<FindAllSubspacesByKeyListOperation> =
{
  handle: async (
    operation: FindAllSubspacesByKeyListOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    const { commitment } = scope;
    const { chunkSize } = operation.input;
    // const { loadJsonMetadata = false } = operation.input;

    const { 
      keys,
      loadJsonMetadata = true
    } = operation.input;

    const subspaceInfos = await GmaBuilder.make(
      ju,
      keys,
      {
        chunkSize,
        commitment,
      }
    ).get();
    scope.throwIfCanceled();

    const subspaces: Subspace[] = [];

    for (const account of subspaceInfos) {
      if (account.exists) {
        try {
          const subspaceAccount = toSubspaceAccount(account);

          // TO-DO: Catching metadata here might be slow, need to find the way...
          const { metadataUri } = subspaceAccount.data;
          let metadataJson: Option<SubspaceJsonMetadata<string>> = null

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
    }

    return subspaces;
  },
};