import {
  createUpdateSubspaceManagerInstruction, SubspaceManagementRoleType
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

const Key = 'UpdateSubspaceManagerOperation' as const;

/**
 * Creates a Subspace Manager.
 *
 * ```ts
 * await ju
 *   .core()
 *   .subspaces(app)
 *   .updateSubspaceManager({ });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const updateSubspaceManagerOperation =
  useOperation<UpdateSubspaceManagerOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type UpdateSubspaceManagerOperation = Operation<
  typeof Key,
  UpdateSubspaceManagerInput,
  UpdateSubspaceManagerOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type UpdateSubspaceManagerInput = {
  /** App current App address. */
  app: PublicKey;

  /** Subspace */
  subspace: PublicKey;

  /** Profile to add as Manager */
  profile: PublicKey;

  /** Manager Role */
  role: SubspaceManagementRoleType
};

/**
 * @group Operations
 * @category Outputs
 */
export type UpdateSubspaceManagerOutput = {
  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const updateSubspaceManagerOperationHandler: OperationHandler<UpdateSubspaceManagerOperation> =
{
  async handle(
    operation: UpdateSubspaceManagerOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<UpdateSubspaceManagerOutput> {
    const builder = updateSubspaceManagerBuilder(
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
export type UpdateSubspaceManagerBuilderParams = Omit<
  UpdateSubspaceManagerInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type UpdateSubspaceManagerBuilderContext = Omit<
  UpdateSubspaceManagerOutput,
  'response'
>;

/**
 * Creates an Subspace.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .app()
 *   .builders()
 *   .updateSubspaceManager({ })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const updateSubspaceManagerBuilder = (
  ju: Ju,
  params: UpdateSubspaceManagerBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<UpdateSubspaceManagerBuilderContext> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;

  const {
    app,
    subspace,
    profile,
    role
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

  const connectionProof = ju
    .core()
    .pdas()
    .connection({
      app,
      initializer: profile,
      target: subspace,
      programs,
    });

  return (
    TransactionBuilder.make<UpdateSubspaceManagerBuilderContext>()
      .setFeePayer(payer)
      .setContext({})

      // Create and initialize the Subspace account.
      .add({
        instruction: createUpdateSubspaceManagerInstruction(
          {
            app,
            subspace,
            profile,
            manager: subspaceManagerPda,
            connectionProof, 
            authority: authority.publicKey,
          },
          {
            managerRole: role
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'updateSubspaceManager',
      })
  );
};