import {
  createUpdatePublicationInstruction,
  PublicationData
} from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { Publication } from '../../models/Publication';
// import { toOptionalAccount } from '../../helpers';
import { ExternalProcessors } from '../../types';
import { findPublicationByAddressOperation } from './findPublicationByAddress';
import { TransactionBuilder, TransactionBuilderOptions } from '@/utils';
import {
  // isSigner,
  makeConfirmOptionsFinalizedOnMainnet,
  Operation,
  OperationHandler,
  OperationScope,
  PublicKey,
  // Signer,
  toPublicKey,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';
// import { ExpectedSignerError } from '@/errors';

// -----------------
// Operation
// -----------------

const Key = 'UpdatePublicationOperation' as const;

/**
 * Updates an existing Application Publication.
 *
 * ```ts
 * const publication = await ju
 *   .core()
 *   .updatePublication({ });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const updatePublicationOperation =
  useOperation<UpdatePublicationOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type UpdatePublicationOperation = Operation<
  typeof Key,
  UpdatePublicationInput,
  UpdatePublicationOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type UpdatePublicationInput = {
  /** App current App address. */
  app: PublicKey;

  /** Publication Address */
  publication: PublicKey;

  /** Publication data*/
  data: PublicationData;

  /** Individual External Processors. */
  externalProcessors: Omit<ExternalProcessors, 'registeringProcessor' | 'connectingProcessor' | 'publishingProcessor'>;

  /**
   * Whether or not we should fetch the JSON Metadata for response.
   *
   * @defaultValue `true`
   */
  loadJsonMetadata?: boolean;
};

/**
 * @group Operations
 * @category Outputs
 */
export type UpdatePublicationOutput = {
  /** The address of the Publication. */
  publicationAddress: PublicKey;

  /** Publication model. */
  publication: Publication;

  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const updatePublicationOperationHandler: OperationHandler<UpdatePublicationOperation> =
{
  async handle(
    operation: UpdatePublicationOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<UpdatePublicationOutput> {
    const builder = updatePublicationBuilder(
      ju,
      operation.input,
      scope
    );

    const confirmOptions = makeConfirmOptionsFinalizedOnMainnet(
      ju,
      scope.confirmOptions
    );
    const output = await builder.sendAndConfirm(ju, confirmOptions);
    scope.throwIfCanceled();

    // Retrieve Publication
    const publication = await ju
      .operations()
      .execute(findPublicationByAddressOperation(
        {
          publication: output.publicationAddress,
          loadJsonMetadata: operation.input.loadJsonMetadata
        },
      ),
        scope
      );
    scope.throwIfCanceled();

    if (!publication) {
      // TO-DO
      throw ('Publication not found')
    }

    return { ...output, publication };
  },
};

// -----------------
// Builder
// -----------------

/**
 * @group Transaction Builders
 * @category Inputs
 */
export type UpdatePublicationBuilderParams = Omit<
  UpdatePublicationInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};;

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type UpdatePublicationBuilderContext = Omit<
  UpdatePublicationOutput,
  'response' | 'publication'
>;

/**
 * Updates an Publication.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .publication()
 *   .builders()
 *   .updatePublication({ })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const updatePublicationBuilder = (
  ju: Ju,
  params: UpdatePublicationBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<UpdatePublicationBuilderContext> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;

  const {
    app,
    publication,
    data,
    externalProcessors
  } = params;

  // Accounts.
  const authority = ju.identity();

  // PDAs.
  const publicationCreatorPda = ju
    .core()
    .pdas()
    .profile({
      app,
      authority: toPublicKey(authority),
      programs,
    });

  // Deriving JXP PDAs
  let collectingProcessorPda = ju.programs().getJuCore().address;
  if (externalProcessors.collectingProcessor) {
    collectingProcessorPda = ju
      .core()
      .pdas()
      .processor(
        {
          program: externalProcessors.collectingProcessor
        }
      )
  }

  let referencingProcessorPda = ju.programs().getJuCore().address;
  if (externalProcessors.referencingProcessor) {
    referencingProcessorPda = ju
      .core()
      .pdas()
      .processor(
        {
          program: externalProcessors.referencingProcessor
        }
      )
  }

  return (
    TransactionBuilder.make<UpdatePublicationBuilderContext>()
      .setFeePayer(payer)
      .setContext({
        publicationAddress: publication,
      })

      // Update the Publication account.
      .add({
        instruction: createUpdatePublicationInstruction(
          {
            app,
            profile: publicationCreatorPda,
            publication,

            collectingProcessorPda,
            referencingProcessorPda,

            authority: toPublicKey(authority),
          },
          {
            data
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'updatePublication',
      })
  );
};