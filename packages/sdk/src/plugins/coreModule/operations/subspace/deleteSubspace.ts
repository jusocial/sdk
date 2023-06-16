import { createDeleteSubspaceInstruction } from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { toOptionalAccount } from '../../helpers';
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

const Key = 'DeleteSubspaceOperation' as const;

/**
 * Deletes an existing Subspace.
 *
 * ```ts
 * await ju
 *   .core()
 *   .deleteSubspace({ subspacce });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const deleteSubspaceOperation = useOperation<DeleteSubspaceOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type DeleteSubspaceOperation = Operation<
  typeof Key,
  DeleteSubspaceInput,
  DeleteSubspaceOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type DeleteSubspaceInput = {
  /** App current App address. */
  app: PublicKey;

  /** The address of the Subspace. */
  subspace: PublicKey;

  /** Subspace Alias (need to be passed if Subspace has one) */
  alias?: string;
};

/**
 * @group Operations
 * @category Outputs
 */
export type DeleteSubspaceOutput = {
  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const deleteSubspaceOperationHandler: OperationHandler<DeleteSubspaceOperation> = {
  handle: async (
    operation: DeleteSubspaceOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<DeleteSubspaceOutput> => {
    return deleteSubspaceBuilder(ju, operation.input, scope).sendAndConfirm(
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
export type DeleteSubspaceBuilderParams = Omit<DeleteSubspaceInput, 'confirmOptions'> & {
  /** A key to distinguish the instruction that burns the Subspace. */
  instructionKey?: string;
};

/**
 * Deletes an existing Subspace.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .core()
 *   .builders()
 *   .deleteSubspace({});
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const deleteSubspaceBuilder = (
  ju: Ju,
  params: DeleteSubspaceBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder => {
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;
  const { app, subspace, alias } = params;

  // Accounts.
  const authority = ju.identity();

  
  // TO-DO: Not sure it is good idea to pass alias into operation
  // See commenteed code down below 
  const aliasPda = !alias
    ? undefined
    : ju.core().pdas().alias({
      app,
      alias,
      programs,
    });

  // TO_DO: May be better to retrieve alias from Subspace account?
  //
  // // Retrieve Subspace
  // const retrievedSubspace = await ju
  //   .core()
  //   .findSubspaceByAddress(
  //     {
  //       subspace,
  //     },
  //     scope
  //   );
  // const aliasPda = retrievedSubspace.data.alias;

  return TransactionBuilder.make()
    .add({
      instruction: createDeleteSubspaceInstruction(
        {
          app,
          subspace,
          aliasPda: toOptionalAccount(aliasPda),
          authority: toPublicKey(authority),
        }
      ),
      signers: [payer],
      key: params.instructionKey ?? 'deleteSubspace',
    });
};
