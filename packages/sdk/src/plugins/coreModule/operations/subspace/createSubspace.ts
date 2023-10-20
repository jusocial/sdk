import {
  createCreateSubspaceInstruction, SubspaceData
} from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { Subspace } from '../../models/Subspace';
import { generateUuid, toOptionalAccount } from '../../helpers';
import { ExternalProcessors } from '../../types';
import { findSubspaceByAddressOperation } from './findSubspaceByAddress';
import { TransactionBuilder, TransactionBuilderOptions } from '@/utils';
import {
  makeConfirmOptionsFinalizedOnMainnet,
  Operation,
  OperationHandler,
  OperationScope,
  Pda,
  PublicKey,
  toPublicKey,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';
// import { ExpectedSignerError } from '@/errors';

// -----------------
// Operation
// -----------------

const Key = 'CreateSubspaceOperation' as const;

/**
 * Creates an Application Subspace.
 *
 * ```ts
 * await ju
 *   .core()
 *   .subspaces(app)
 *   .createSubspace({ });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const createSubspaceOperation =
  useOperation<CreateSubspaceOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type CreateSubspaceOperation = Operation<
  typeof Key,
  CreateSubspaceInput,
  CreateSubspaceOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type CreateSubspaceInput = {
  /** App current App address. */
  app: PublicKey;

  /** Subspace Data. */
  data: SubspaceData;

  /** Individual External Processors. */
  externalProcessors: Omit<ExternalProcessors, 'registeringProcessor'>;

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
export type CreateSubspaceOutput = {
  /** The address of the Subspace. */
  subspaceAddress: PublicKey;

  /** Subspace model. */
  subspace: Subspace;

  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const createSubspaceOperationHandler: OperationHandler<CreateSubspaceOperation> =
{
  async handle(
    operation: CreateSubspaceOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<CreateSubspaceOutput> {
    const builder = createSubspaceBuilder(
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

    // Retrieve Subspace
    const subspace = await ju
      .operations()
      .execute(findSubspaceByAddressOperation(
        {
          subspace: output.subspaceAddress,
          loadJsonMetadata: operation.input.loadJsonMetadata
        },
      ),
        scope
      );


    if (!subspace) {
      // TO-DO
      throw ('Subspace not found')
    }

    return { ...output, subspace };
  },
};

// -----------------
// Builder
// -----------------

/**
 * @group Transaction Builders
 * @category Inputs
 */
export type CreateSubspaceBuilderParams = Omit<
  CreateSubspaceInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type CreateSubspaceBuilderContext = Omit<
  CreateSubspaceOutput,
  'response' | 'subspace'
>;

/**
 * Creates an Subspace.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .app()
 *   .builders()
 *   .createSubspace({ })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const createSubspaceBuilder = (
  ju: Ju,
  params: CreateSubspaceBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<CreateSubspaceBuilderContext> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;

  const {
    app,
    data,
    externalProcessors
  } = params;

  // UUID
  const uuid = generateUuid();

  // Accounts.
  const authority = ju.identity();

  // PDAs.
  const subspaceCreatorPda = ju
    .core()
    .pdas()
    .profile({
      app,
      authority: toPublicKey(authority),
      programs,
    });

  const subspacePda = ju
    .core()
    .pdas()
    .subspace({
      app,
      creator: subspaceCreatorPda,
      uuid,
      programs,
    });

  let aliasPda: Pda | null = null;
  if (data.alias) {
    aliasPda = ju.core().pdas().alias({
      app,
      alias: data.alias,
      programs,
    });
  }


  // Deriving JXP PDAs

  let connectingProcessorPda = ju.programs().getJuCore().address;
  if (externalProcessors.connectingProcessor) {
    connectingProcessorPda = ju
      .core()
      .pdas()
      .processor(
        {
          program: externalProcessors.connectingProcessor
        }
      )
  }

  let publishingProcessorPda = ju.programs().getJuCore().address;
  if (externalProcessors.publishingProcessor) {
    publishingProcessorPda = ju
      .core()
      .pdas()
      .processor(
        {
          program: externalProcessors.publishingProcessor
        }
      )
  }

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
    TransactionBuilder.make<CreateSubspaceBuilderContext>()
      .setFeePayer(payer)
      .setContext({
        subspaceAddress: subspacePda,
      })

      // Create and initialize the Subspace account.
      .add({
        instruction: createCreateSubspaceInstruction(
          {
            app,
            creatorProfile: subspaceCreatorPda,
            subspace: subspacePda,
            aliasPda: toOptionalAccount(aliasPda),

            connectingProcessorPda,
            publishingProcessorPda,
            collectingProcessorPda,
            referencingProcessorPda,

            authority: toPublicKey(authority),
          },
          {
            uuid,
            data
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'createSubspace',
      })
  );
};