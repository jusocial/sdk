import type { PublicKey } from '@solana/web3.js';
import { toPublicationAccount } from '../../accounts';
import { Publication, toPublication } from '../../models/Publication';
import { PublicationJsonMetadata } from '../../models';
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

const Key = 'FindPublicationByAddressOperation' as const;

/**
 * Finds an Publication by its address.
 *
 * ```ts
 * const publication = await ju
 *   .core()
 *   .findPublicationByAddress(
 *      { 
 *        publication: JP8sM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUQgT,
 *        loadJsonMetadata: true
 *      }
 *    );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findPublicationByAddressOperation =
  useOperation<FindPublicationByAddressOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindPublicationByAddressOperation = Operation<
  typeof Key,
  FindPublicationByAddressInput,
  FindPublicationByAddressOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindPublicationByAddressInput = {
  // /** The address of the Application. */
  // app: PublicKey;

  /** The address of the Publication. */
  publication: PublicKey;

  /**
   * Whether or not we should fetch the JSON Metadata.
   *
   * @defaultValue `true`
   */
  loadJsonMetadata?: boolean;
};

export type FindPublicationByAddressOutput = Publication;

/**
 * @group Operations
 * @category Handlers
 */
export const findPublicationByAddressOperationHandler: OperationHandler<FindPublicationByAddressOperation> =
{
  handle: async (
    operation: FindPublicationByAddressOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    const { commitment } = scope;
    const { 
      publication,
      loadJsonMetadata = true
    } = operation.input;

    const account = await ju
      .rpc()
      .getAccount(publication, commitment);
    scope.throwIfCanceled();

    if (!account.exists) {
      // TO-DO
      throw Error('Publication not found');
      // return null;
    }

    const publicationAccount = toPublicationAccount(account);

    let metadataJson: PublicationJsonMetadata<string> = {}
    if (loadJsonMetadata) {
      try {
        metadataJson = await ju
          .storage()
          .downloadJson<PublicationJsonMetadata>(publicationAccount.data.metadataUri, scope);
      } catch (error) {
        // TO-DO
      }
    }

    // if (publicationAccount.data.authority.toBase58() === ju.identity().publicKey.toBase58()) {
    //   return new PublicationAdmin(
    //     ju,
    //     publicationAccount,
    //     metadataJson
    //   );
    // }
    
    return toPublication(
      publicationAccount,
      metadataJson
    );
  },
};