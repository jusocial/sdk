import {
  createDeleteSubspaceManagerInstruction
} from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { TransactionBuilder, TransactionBuilderOptions } from '@/utils';
import {
  makeConfirmOptionsFinalizedOnMainnet,
  Operation,
  OperationHandler,
  OperationScope,
  PublicKey,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';
// import { ExpectedSignerError } from '@/errors';

// -----------------
// Operation
// -----------------

const Key = 'DeleteSubspaceManagerOperation' as const;

/**
 * Delete an existing Subspace Manager.
 *
 * ```ts
 * await ju
 *   .core()
 *   .subspaces(app)
 *   .deleteSubspaceManager({ });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const deleteSubspaceManagerOperation =
  useOperation<DeleteSubspaceManagerOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type DeleteSubspaceManagerOperation = Operation<
  typeof Key,
  DeleteSubspaceManagerInput,
  DeleteSubspaceManagerOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type DeleteSubspaceManagerInput = {
  /** App current App address. */
  app: PublicKey;

  /** Subspace */
  subspace: PublicKey;

  /** Profile to add as Manager */
  profile: PublicKey;
};

/**
 * @group Operations
 * @category Outputs
 */
export type DeleteSubspaceManagerOutput = {
  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const deleteSubspaceManagerOperationHandler: OperationHandler<DeleteSubspaceManagerOperation> =
{
  async handle(
    operation: DeleteSubspaceManagerOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<DeleteSubspaceManagerOutput> {
    const builder = deleteSubspaceManagerBuilder(
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


    return { ...output };
  },
};

// -----------------
// Builder
// -----------------

/**
 * @group Transaction Builders
 * @category Inputs
 */
export type DeleteSubspaceManagerBuilderParams = Omit<
  DeleteSubspaceManagerInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type DeleteSubspaceManagerBuilderContext = Omit<
  DeleteSubspaceManagerOutput,
  'response'
>;

/**
 * Creates an Subspace.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .app()
 *   .builders()
 *   .deleteSubspaceManager({ })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const deleteSubspaceManagerBuilder = (
  ju: Ju,
  params: DeleteSubspaceManagerBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<DeleteSubspaceManagerBuilderContext> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;

  const {
    app,
    subspace,
    profile
  } = params;

  // Accounts.
  const authority = ju.identity();

  // PDAs.
  const subspaceManagerPda = ju
    .core()
    .pdas()
    .subspaceManager({
      subspace,
      profile,
      programs,
    });

  return (
    TransactionBuilder.make<DeleteSubspaceManagerBuilderContext>()
      .setFeePayer(payer)
      .setContext({})

      // Create and initialize the Subspace account.
      .add({
        instruction: createDeleteSubspaceManagerInstruction(
          {
            app,
            subspace,
            profile,
            manager: subspaceManagerPda,
            authority: authority.publicKey,
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'deleteSubspaceManager',
      })
  );
};