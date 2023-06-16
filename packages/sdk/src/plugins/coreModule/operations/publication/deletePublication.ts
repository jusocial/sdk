import { createDeletePublicationInstruction } from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { Ju } from '@/Ju';
import {
  Operation,
  OperationHandler,
  OperationScope,
  PublicKey,
  // Signer,
  toPublicKey,
  useOperation,
} from '@/types';
import { TransactionBuilder, TransactionBuilderOptions } from '@/utils';

// -----------------
// Operation
// -----------------

const Key = 'DeletePublicationOperation' as const;

/**
 * Deletes an existing Publication.
 *
 * ```ts
 * await ju
 *   .core()
 *   .deletePublication({ appId, publication });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const deletePublicationOperation = useOperation<DeletePublicationOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type DeletePublicationOperation = Operation<
  typeof Key,
  DeletePublicationInput,
  DeletePublicationOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type DeletePublicationInput = {
  /** App current App address. */
  app: PublicKey;

  /** The address of the Publication. */
  publication: PublicKey;
};

/**
 * @group Operations
 * @category Outputs
 */
export type DeletePublicationOutput = {
  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const deletePublicationOperationHandler: OperationHandler<DeletePublicationOperation> = {
  handle: async (
    operation: DeletePublicationOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<DeletePublicationOutput> => {
    return deletePublicationBuilder(ju, operation.input, scope).sendAndConfirm(
      ju,
      scope.confirmOptions
    );
  },
};

// -----------------
// Builder
// -----------------

/**
 * @group Transaction Builders
 * @category Inputs
 */
export type DeletePublicationBuilderParams = Omit<DeletePublicationInput, 'confirmOptions'> & {
  /** A key to distinguish the instruction that burns the Publication. */
  instructionKey?: string;
};

/**
 * Deletes an existing Publication.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .core()
 *   .builders()
 *   .deletePublication({});
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const deletePublicationBuilder = (
  ju: Ju,
  params: DeletePublicationBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder => {
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;
  const { app, publication } = params;

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

  return TransactionBuilder.make()
    .add({
      instruction: createDeletePublicationInstruction(
        {
          app,
          profile: publicationCreatorPda,
          publication,
          authority: toPublicKey(authority),
        }
      ),
      signers: [payer],
      key: params.instructionKey ?? 'deletePublication',
    });
};
