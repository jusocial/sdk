import {
  createCreateProfileInstruction, ProfileData
} from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { Profile } from '../../models/Profile';
import { toOptionalAccount } from '../../helpers';
import { findProfileByAddressOperation } from './findProfileByAddress';
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

// -----------------
// Operation
// -----------------

const Key = 'CreateProfileOperation' as const;

/**
 * Creates an Application Profile.
 *
 * ```ts
 * await ju
 *   .core()
 *   .profiles(app)
 *   .createProfile(
 *      {
 *        data: {},
 *        externalProcessors: {}
 *      });
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const createProfileOperation =
  useOperation<CreateProfileOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type CreateProfileOperation = Operation<
  typeof Key,
  CreateProfileInput,
  CreateProfileOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type CreateProfileInput = {
  /** App current App address. */
  app: PublicKey;

  /** Profile instruction data */
  data: ProfileData;

  /** Data might be passed into Registering Processor */
  externalProcessingData?: string;

  /** Connecting Processor. */
  connectingProcessor?: PublicKey;

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
export type CreateProfileOutput = {
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
export const createProfileOperationHandler: OperationHandler<CreateProfileOperation> =
{
  async handle(
    operation: CreateProfileOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<CreateProfileOutput> {
    const builder = createProfileBuilder(
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
export type CreateProfileBuilderParams = Omit<
  CreateProfileInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type CreateProfileBuilderContext = Omit<
  CreateProfileOutput,
  'response' | 'profile'
>;

/**
 * Creates an Profile.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .app()
 *   .builders()
 *   .createProfile({ })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const createProfileBuilder = (
  ju: Ju,
  params: CreateProfileBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<CreateProfileBuilderContext> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;

  const {
    app,
    data,
    externalProcessingData = null,
    connectingProcessor
  } = params;

  const { alias } = params.data;

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

  let aliasPda: Pda | null = null;
  if (alias) {
    aliasPda = ju.core().pdas().alias({
      app,
      alias,
      programs,
    });
  }

  return (
    TransactionBuilder.make<CreateProfileBuilderContext>()
      .setFeePayer(payer)
      .setContext({
        profileAddress: profilePda,
      })

      // Create and initialize the Profile account.
      .add({
        instruction: createCreateProfileInstruction(
          {
            app,
            profile: profilePda,
            aliasPda: toOptionalAccount(aliasPda),
            connectingProcessorPda: toOptionalAccount(connectingProcessor),
            authority: toPublicKey(authority),
          },
          {
            data,
            externalProcessingData
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'createProfile',
      })
  );
};