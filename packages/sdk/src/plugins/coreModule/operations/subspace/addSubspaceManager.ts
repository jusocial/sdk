import {
  createAddSubspaceManagerInstruction, SubspaceManagementRoleType
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

const Key = 'AddSubspaceManagerOperation' as const;

/**
 * Creates a Subspace Manager.
 *
 * ```ts
 * await ju
 *   .core()
 *   .subspaces(app)
 *   .addSubspaceManager({ });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const addSubspaceManagerOperation =
  useOperation<AddSubspaceManagerOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type AddSubspaceManagerOperation = Operation<
  typeof Key,
  AddSubspaceManagerInput,
  AddSubspaceManagerOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type AddSubspaceManagerInput = {
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
export type AddSubspaceManagerOutput = {
  /** The address of the Subspace Manager PDA. */
  subspaceManagerAddress: PublicKey;

  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const addSubspaceManagerOperationHandler: OperationHandler<AddSubspaceManagerOperation> =
{
  async handle(
    operation: AddSubspaceManagerOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<AddSubspaceManagerOutput> {
    const builder = addSubspaceManagerBuilder(
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
export type AddSubspaceManagerBuilderParams = Omit<
  AddSubspaceManagerInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type AddSubspaceManagerBuilderContext = Omit<
  AddSubspaceManagerOutput,
  'response'
>;

/**
 * Creates an Subspace.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .app()
 *   .builders()
 *   .addSubspaceManager({ })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const addSubspaceManagerBuilder = (
  ju: Ju,
  params: AddSubspaceManagerBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<AddSubspaceManagerBuilderContext> => {
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
    TransactionBuilder.make<AddSubspaceManagerBuilderContext>()
      .setFeePayer(payer)
      .setContext({
        subspaceManagerAddress: subspaceManagerPda,
      })

      // Create and initialize the Subspace account.
      .add({
        instruction: createAddSubspaceManagerInstruction(
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
        key: params.instructionKey ?? 'addSubspaceManager',
      })
  );
};