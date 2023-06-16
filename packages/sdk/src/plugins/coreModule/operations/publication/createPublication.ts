import {
  ContentType,
  createCreatePublicationInstruction
} from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { Publication } from '../../models/Publication';
import { generateUuid, toOptionalAccount } from '../../helpers';;
import { ExternalProcessors } from '../../types';
import { TransactionBuilder, TransactionBuilderOptions } from '@/utils';
import {
  makeConfirmOptionsFinalizedOnMainnet,
  Operation,
  OperationHandler,
  OperationScope,
  PublicKey,
  toPublicKey,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';
// import { ExpectedSignerError } from '@/errors';

// -----------------
// Operation
// -----------------

const Key = 'CreatePublicationOperation' as const;

/**
 * Creates an Application Publication.
 *
 * ```ts
 * await ju
 *   .core()
 *   .createPublication({ });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const createPublicationOperation =
  useOperation<CreatePublicationOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type CreatePublicationOperation = Operation<
  typeof Key,
  CreatePublicationInput,
  CreatePublicationOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type CreatePublicationInput = {
  /** App current App address. */
  app: PublicKey;

  /** Is Publication mirroring another Publication */
  isMirror?: boolean;

  /** Is Publication replying to another Publication */
  isReply?: boolean;

  /** Target Publication address. */
  target?: PublicKey;

  /** Subspace as Publication destination */
  subspace?: PublicKey;

  /** Publication metadata URI. */
  metadataUri: string;

  /** Publication Content type
  * Article = 0,
  * Image = 1,
  * Video = 2,
  * ShortVideo = 3,
  * Audio = 4,
  * Text = 5,
  * Link = 6 
  */
  contentType?: ContentType;

  /** Publication Tag */
  tag?: string,

  /** Data might be passed into Registering Processor */
  externalProcessingData?: string;


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
export type CreatePublicationOutput = {
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
export const createPublicationOperationHandler: OperationHandler<CreatePublicationOperation> =
{
  async handle(
    operation: CreatePublicationOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<CreatePublicationOutput> {
    const builder = createPublicationBuilder(
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
      .core()
      .publication
      .get(
        output.publicationAddress,
        scope
      );

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
export type CreatePublicationBuilderParams = Omit<
  CreatePublicationInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type CreatePublicationBuilderContext = Omit<
  CreatePublicationOutput,
  'response' | 'publication'
>;

/**
 * Creates an Publication.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .app()
 *   .builders()
 *   .createPublication({ })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const createPublicationBuilder = (
  ju: Ju,
  params: CreatePublicationBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<CreatePublicationBuilderContext> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;

  const {
    app,
    target = null,
    subspace = null,
    isMirror = false,
    isReply = false,
    contentType = 0,
    metadataUri,
    tag = null,
    externalProcessingData = null,
    externalProcessors
  } = params;

  const uuid = generateUuid();

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

  const publicationPda = ju
    .core()
    .pdas()
    .publication({
      app,
      uuid,
      programs,
    });

  return (
    TransactionBuilder.make<CreatePublicationBuilderContext>()
      .setFeePayer(payer)
      .setContext({
        publicationAddress: publicationPda,
      })

      // Create and initialize the Publication account.
      .add({
        instruction: createCreatePublicationInstruction(
          {
            app,
            profile: publicationCreatorPda,
            publication: publicationPda,

            subspace: toOptionalAccount(subspace),
            targetPublication: toOptionalAccount(target),

            collectingProcessorPda: toOptionalAccount(externalProcessors.collectingProcessor),
            referencingProcessorPda: toOptionalAccount(externalProcessors.referencingProcessor),

            authority: toPublicKey(authority),
          },
          {
            uuid,
            data: {
              isMirror,
              isReply,
              contentType,
              metadataUri,
              tag,
            },
            // TO-DO
            externalProcessingData
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'createPublication',
      })
  );
};