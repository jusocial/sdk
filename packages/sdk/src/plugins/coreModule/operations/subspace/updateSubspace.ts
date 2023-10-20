import {
  createUpdateSubspaceInstruction, SubspaceData
} from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { Subspace } from '../../models/Subspace';
import { toOptionalAccount } from '../../helpers';
import { ExternalProcessors } from '../../types';
import { findSubspaceByAddressOperation } from './findSubspaceByAddress';
import { TransactionBuilder, TransactionBuilderOptions } from '@/utils';
import {
  // isSigner,
  makeConfirmOptionsFinalizedOnMainnet,
  Operation,
  OperationHandler,
  OperationScope,
  Pda,
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

const Key = 'UpdateSubspaceOperation' as const;

/**
 * Updates an existing Application Subspace.
 *
 * ```ts
 * const subspace = await ju
 *   .core()
 *   .updateSubspace({ });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const updateSubspaceOperation =
  useOperation<UpdateSubspaceOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type UpdateSubspaceOperation = Operation<
  typeof Key,
  UpdateSubspaceInput,
  UpdateSubspaceOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type UpdateSubspaceInput = {
  /** App current App address. */
  app: PublicKey;

  /** Subspace Address */
  subspace: PublicKey;

  /** Connecting Processor. */
  data: SubspaceData;

  /** Current Profile alias */
  currentAlias?: string | null;

  /** Individual External Processors. */
  externalProcessors: Omit<ExternalProcessors, 'registeringProcessor'>;

  /**
   * Whether or not we should fetch the JSON Metadata.
   *
   * @defaultValue `true`
   */
  loadJsonMetadata?: boolean;
};

/**
 * @group Operations
 * @category Outputs
 */
export type UpdateSubspaceOutput = {
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
export const updateSubspaceOperationHandler: OperationHandler<UpdateSubspaceOperation> =
{
  async handle(
    operation: UpdateSubspaceOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<UpdateSubspaceOutput> {
    const builder = updateSubspaceBuilder(
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
export type UpdateSubspaceBuilderParams = Omit<
  UpdateSubspaceInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};;

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type UpdateSubspaceBuilderContext = Omit<
  UpdateSubspaceOutput,
  'response' | 'subspace'
>;

/**
 * Updates an Subspace.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .subspace()
 *   .builders()
 *   .updateSubspace({ alias: "johndoe", metadataUri: "https://arweave.net/xxx" })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const updateSubspaceBuilder = (
  ju: Ju,
  params: UpdateSubspaceBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<UpdateSubspaceBuilderContext> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;

  const {
    app,
    subspace,
    data,
    currentAlias = null,
    externalProcessors
  } = params;

  // Accounts.
  const authority = ju.identity();

  // PDAs.
  const creatorProfilePda = ju
    .core()
    .pdas()
    .profile({
      app,
      authority: toPublicKey(authority),
      programs,
    });

  /** 
  *  # Docs from core program:
  *  # Alias management cases:
  *  
  * 0) Do nothing:
  * - data.alias = <current Subspace alias value>
  * - current_alias_pda == None
  * - new_alias_pda == None
  *
  * 1) Register alias if not yet registered:
  * - data.alias = alias_value
  * - current_alias_pda == None
  * - new_alias_pda == Some(alias_value)
  *
  * 2) Update current alias (register new and delete current):
  * - data.alias = new_alias_value
  * - current_alias_pda == Some(current_alias_value)
  * - new_alias_pda == Some(new_alias_value)
  *
  * 3) Delete current alias:
  * - data.alias = None
  * - current_alias_pda == Some(current_alias_value)
  * - new_alias_pda == None
  */

  let currentAliasPda: Pda | null = null;
  if (currentAlias && (currentAlias != data.alias)) {
    currentAliasPda = ju.core().pdas().alias({
      app,
      alias: currentAlias,
      programs,
    });
  }

  let newAliasPda: Pda | null = null;
  if (data.alias && (currentAlias != data.alias)) {
    newAliasPda = ju.core().pdas().alias({
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
    TransactionBuilder.make<UpdateSubspaceBuilderContext>()
      .setFeePayer(payer)
      .setContext({
        subspaceAddress: subspace,
      })

      // Update the Subspace account.
      .add({
        instruction: createUpdateSubspaceInstruction(
          {
            app,
            creatorProfile: creatorProfilePda,
            subspace,

            currentAliasPda: toOptionalAccount(currentAliasPda),
            newAliasPda: toOptionalAccount(newAliasPda),

            connectingProcessorPda,
            publishingProcessorPda,
            collectingProcessorPda,
            referencingProcessorPda,

            authority: toPublicKey(authority),
          },
          {
            data,
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'updateSubspace',
      })
  );
};