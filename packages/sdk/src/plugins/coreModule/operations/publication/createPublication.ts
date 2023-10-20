import {
  ContentType,
  createCreatePublicationInstruction,
  Publication as PublicationCore
} from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { Publication } from '../../models/Publication';
import { generateUuid, toOptionalAccount } from '../../helpers';;
import { ExternalProcessors } from '../../types';
import { findPublicationByAddressOperation } from './findPublicationByAddress';
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

  /**
   * Whether or not Publication contain encrypted content
   *
   * @defaultValue `false`
   */
  isEncrypted?: boolean;

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
    const builder = await createPublicationBuilder(
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
export const createPublicationBuilder = async (
  ju: Ju,
  params: CreatePublicationBuilderParams,
  options: TransactionBuilderOptions = {}
): Promise<TransactionBuilder<CreatePublicationBuilderContext>> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;

  const {
    app,
    target = null,
    subspace = null,
    isMirror = false,
    isReply = false,
    contentType = 0,
    isEncrypted = false,
    metadataUri,
    tag = '',
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


  let connectionProof: PublicKey | null = null;
  let subspaceManagerProof: PublicKey | null = null;

  if (subspace) {
    const connectionAccount = ju
      .core()
      .pdas()
      .connection({
        app,
        initializer: publicationCreatorPda,
        target: subspace,
        programs,
      });

    const isConnectionExist = await ju.rpc().accountExists(connectionAccount);

    if (isConnectionExist) {
      connectionProof = connectionAccount;
    }


    const subspaceManagerAccount = ju
      .core()
      .pdas()
      .subspaceManager({
        subspace,
        profile: publicationCreatorPda,
        programs,
      });

    const isSubspaceManagerExist = await ju.rpc().accountExists(subspaceManagerAccount);

    if (isSubspaceManagerExist) {
      subspaceManagerProof = subspaceManagerAccount;
    }
  }

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

  // Get JXP from App
  const { publishingProcessor, referencingProcessor } = await ju.core().apps().getApp(app);

  // Trying to get JPX from target
  let referencingProcessorIndividual: PublicKey | null = null;
  if (target) {
    try {
      const mayBePublication = await PublicationCore.fromAccountAddress(ju.connection, target);
      referencingProcessorIndividual = mayBePublication.referencingProcessor;
    } catch (error) {
      // target is invalid
    }
  }

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

            connectionProof: toOptionalAccount(connectionProof),
            subspaceManagerProof: toOptionalAccount(subspaceManagerProof),

            targetPublication: toOptionalAccount(target),

            collectingProcessorPda,
            referencingProcessorPda,

            publishingProcessor: toOptionalAccount(publishingProcessor),
            referencingProcessor: toOptionalAccount(referencingProcessor),
            referencingProcessorIndividual: toOptionalAccount(referencingProcessorIndividual),

            authority: toPublicKey(authority),
          },
          {
            uuid,
            data: {
              isMirror,
              isReply,
              contentType,
              isEncrypted,
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