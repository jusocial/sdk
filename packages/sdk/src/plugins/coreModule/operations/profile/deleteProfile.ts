import { createDeleteProfileInstruction } from '@ju-protocol/ju-core';
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
import { Option, TransactionBuilder, TransactionBuilderOptions } from '@/utils';

// -----------------
// Operation
// -----------------

const Key = 'DeleteProfileOperation' as const;

/**
 * Deletes an existing Profile.
 *
 * ```ts
 * await ju
 *   .app()
 *   .prodiles(app)
 *   .deleteProfile(
 *      {
 *        profile: asUsM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUQsD
 *      });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const deleteProfileOperation = useOperation<DeleteProfileOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type DeleteProfileOperation = Operation<
  typeof Key,
  DeleteProfileInput,
  DeleteProfileOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type DeleteProfileInput = {
  /** App current App address. */
  app: PublicKey;

  /** The address of the Profile. */
  profile: PublicKey;

  /** The current Alias of the Profile. */
  alias: Option<string>;
};

/**
 * @group Operations
 * @category Outputs
 */
export type DeleteProfileOutput = {
  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const deleteProfileOperationHandler: OperationHandler<DeleteProfileOperation> = {
  handle: async (
    operation: DeleteProfileOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<DeleteProfileOutput> => {
    return deleteProfileBuilder(ju, operation.input, scope).sendAndConfirm(
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
export type DeleteProfileBuilderParams = Omit<DeleteProfileInput, 'confirmOptions'> & {
  /** A key to distinguish the instruction that burns the Profile. */
  instructionKey?: string;
};

/**
 * Deletes an existing Profile.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .profile()
 *   .builders()
 *   .deleteProfile({});
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const deleteProfileBuilder = (
  ju: Ju,
  params: DeleteProfileBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder => {
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;
  const { 
    app,
    alias
   } = params;

  // Accounts.
  const authority = ju.identity();

  // PDAs.
  const profilePda = ju
    .core()
    .pdas()
    .profile({
      app,
      authority: toPublicKey(authority),
      programs,
    });

  const aliasPda = !alias
    ? null
    : ju.core().pdas().alias({
      app,
      alias,
      programs,
    });

  return TransactionBuilder.make()
    .add({
      instruction: createDeleteProfileInstruction(
        {
          app,
          profile: profilePda,
          aliasPda: toOptionalAccount(aliasPda),
          authority: toPublicKey(authority),
        }
      ),
      signers: [payer],
      key: params.instructionKey ?? 'deleteProfile',
    });
};
