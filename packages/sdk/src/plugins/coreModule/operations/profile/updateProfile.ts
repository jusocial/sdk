import {
  createUpdateProfileInstruction, ProfileData
} from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { Profile } from '../../models/Profile';
import { toOptionalAccount } from '../../helpers';
import { ExternalProcessors } from '../../types';
import { findProfileByAddressOperation } from './findProfileByAddress';
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

const Key = 'UpdateProfileOperation' as const;

/**
 * Updates an existing Application Profile.
 *
 * ```ts
 * await ju
 *   .app()
 *   .updateProfile({ metadataUri: "https://arweave.net/xxx" });
 * ```
 *
 * Provide `alias` in case you want to update Profile Alias (handle) as well.
 *
 * ```ts
 * await ju
 *   .app()
 *   .updateProfile({ alias: "johndoe", metadataUri: "https://arweave.net/xxx" };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const updateProfileOperation =
  useOperation<UpdateProfileOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type UpdateProfileOperation = Operation<
  typeof Key,
  UpdateProfileInput,
  UpdateProfileOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type UpdateProfileInput = {
  /** App current App address. */
  app: PublicKey;

  /** Profile data */
  data: ProfileData;

  /** Current Profile alias */
  currentAlias: string | null;

  /** External Processors. */
  externalProcessors: Partial<ExternalProcessors>;

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
export type UpdateProfileOutput = {
  /** The address of the Profile. */
  profileAddress: PublicKey;

  /** Profile model. */
  profile: Profile;

  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const updateProfileOperationHandler: OperationHandler<UpdateProfileOperation> =
{
  async handle(
    operation: UpdateProfileOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<UpdateProfileOutput> {

    const builder = updateProfileBuilder(
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

    // Retrieve Profile
    const profile = await ju
      .operations()
      .execute(findProfileByAddressOperation(
        {
          profile: output.profileAddress,
          loadJsonMetadata: operation.input.loadJsonMetadata
        },
      ), scope);

    return { ...output, profile };
  },
};

// -----------------
// Builder
// -----------------

/**
 * @group Transaction Builders
 * @category Inputs
 */
export type UpdateProfileBuilderParams = Omit<
  UpdateProfileInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};;

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type UpdateProfileBuilderContext = Omit<
  UpdateProfileOutput,
  'response' | 'profile'
>;

/**
 * Updates an Profile.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .profile()
 *   .builders()
 *   .updateProfile({ alias: "johndoe", metadataUri: "https://arweave.net/xxx" })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const updateProfileBuilder = (
  ju: Ju,
  params: UpdateProfileBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<UpdateProfileBuilderContext> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;

  const {
    app,
    data,
    currentAlias,
    externalProcessors
  } = params;
  // const connectingProcessor = params.data.connectingProcessor ?? null;


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
  if (currentAlias && (currentAlias !== data.alias)) {
    currentAliasPda = ju.core().pdas().alias({
      app,
      alias: currentAlias,
      programs,
    });
  }

  let newAliasPda: Pda | null = null;
  if (data.alias && (currentAlias !== data.alias)) {
    newAliasPda = ju.core().pdas().alias({
      app,
      alias: data.alias,
      programs,
    });
  }

  return (
    TransactionBuilder.make<UpdateProfileBuilderContext>()
      .setFeePayer(payer)
      .setContext({
        profileAddress: profilePda,
      })

      // Update the Profile account.
      .add({
        instruction: createUpdateProfileInstruction(
          {
            app,
            profile: profilePda,

            currentAliasPda: toOptionalAccount(currentAliasPda),
            newAliasPda: toOptionalAccount(newAliasPda),

            // TODO
            connectingProcessorPda: toOptionalAccount(externalProcessors.connectingProcessor),

            authority: toPublicKey(authority),
          },
          {
            data
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'updateProfile',
      })
  );
};