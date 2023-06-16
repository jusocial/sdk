import {
  createCollectPublicationInstruction
} from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
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

const Key = 'CollectPublicationOperation' as const;

/**
 * Collects an Application Publication.
 *
 * ```ts
 * await ju
 *   .core()
 *   .collectPublication({ });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const collectPublicationOperation =
  useOperation<CollectPublicationOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type CollectPublicationOperation = Operation<
  typeof Key,
  CollectPublicationInput,
  CollectPublicationOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type CollectPublicationInput = {
  /** App current App address. */
  app: PublicKey;

  /** The address of the Publication. */
  publication: PublicKey;

  /** Data might be passed into Collecting Processor */
  externalProcessingData?: string;
};

/**
 * @group Operations
 * @category Outputs
 */
export type CollectPublicationOutput = {
  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const collectPublicationOperationHandler: OperationHandler<CollectPublicationOperation> =
{
  async handle(
    operation: CollectPublicationOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<CollectPublicationOutput> {
    const builder = collectPublicationBuilder(
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

    // // Retrieve Publication
    // const publication = await ju
    //   .core()
    //   .publication
    //   .get(
    //     output.publicationAddress,
    //     scope
    //   );

    // if (!publication) {
    //   // TO-DO
    //   throw ('Publication not found')
    // }

    return { 
      ...output,
      // publication
     };
  },
};

// -----------------
// Builder
// -----------------

/**
 * @group Transaction Builders
 * @category Inputs
 */
export type CollectPublicationBuilderParams = Omit<
  CollectPublicationInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type CollectPublicationBuilderContext = Omit<
  CollectPublicationOutput,
  'response' | 'publication'
>;

/**
 * Collects an Publication.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .app()
 *   .builders()
 *   .collectPublication({ })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const collectPublicationBuilder = (
  ju: Ju,
  params: CollectPublicationBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<CollectPublicationBuilderContext> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;

  const {
    app,
    publication,
    externalProcessingData = null,
  } = params;

  // Accounts.
  const authority = ju.identity();

  // PDAs.
  const initializerPda = ju
    .core()
    .pdas()
    .profile({
      app,
      authority: toPublicKey(authority),
      programs,
    });

  const collectionItemPda = ju
    .core()
    .pdas()
    .collectionItem({
      app,
      target: publication,
      programs,
    });

  return (
    TransactionBuilder.make<CollectPublicationBuilderContext>()
      .setFeePayer(payer)
      .setContext({
        publicationAddress: publication,
      })

      // Collect and initialize the Publication account.
      .add({
        instruction: createCollectPublicationInstruction(
          {
            app,
            initializer: initializerPda,
            target: publication,

            collectionItem: collectionItemPda,

            authority: toPublicKey(authority),
          },
          {
            externalProcessingData,
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'collectPublication',
      })
  );
};