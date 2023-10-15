import {
  AppData,
  createInitializeAppInstruction,
} from '@ju-protocol/ju-core';
import { SendAndConfirmTransactionResponse } from '../../../rpcModule';
import { App } from '../../models/App';
import { toOptionalAccount } from '../../helpers';
import { ExternalProcessors } from '../../types';
import { TransactionBuilder, TransactionBuilderOptions } from '@/utils';
import {
  makeConfirmOptionsFinalizedOnMainnet,
  Operation,
  OperationHandler,
  OperationScope,
  PublicKey,
  toPublicKey,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';

// -----------------
// Operation
// -----------------

const Key = 'CreateAppOperation' as const;

/**
 * Creates an Application.
 *
 * ```ts
 * await ju
 *   .core()
 *   .createApp(
 *      {
 *        appName: 'jutube',
 *        data: {},
 *        externalProcessors: {}
 *      }
 *    );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const createAppOperation =
  useOperation<CreateAppOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type CreateAppOperation = Operation<
  typeof Key,
  CreateAppInput,
  CreateAppOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type CreateAppInput = {
  /** The name of the App */
  appName: string;

  /** App Instruction data */
  data: AppData;

  /** External Processors. */
  externalProcessors: ExternalProcessors;
};


/**
 * @group Operations
 * @category Outputs
 */
export type CreateAppOutput = {
  /** The address of the App. */
  appAddress: PublicKey;

  /** App model. */
  app: App;

  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const createAppOperationHandler: OperationHandler<CreateAppOperation> =
{
  async handle(
    operation: CreateAppOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<CreateAppOutput> {
    const builder = createAppBuilder(
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

    // Retrieve App
    const retrievedApp = await ju.core().apps().getApp(
      output.appAddress,
      scope
    );
    scope.throwIfCanceled();

    return { ...output, app: retrievedApp };
  },
};

// -----------------
// Builder
// -----------------

/**
 * @group Transaction Builders
 * @category Inputs
 */
export type CreateAppBuilderParams = Omit<
  CreateAppInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};;

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type CreateAppBuilderContext = Omit<
  CreateAppOutput,
  'response' | 'app'
>;

/**
 * Creates an App.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .app()
 *   .builders()
 *   .createApp({ })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const createAppBuilder = (
  ju: Ju,
  params: CreateAppBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<CreateAppBuilderContext> => {
  // Data.
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;
  const {
    appName,
    data,
    externalProcessors
  } = params;

  // Accounts.
  const authority = toPublicKey(ju.identity());

  // PDAs.
  const appPda = ju
    .core()
    .pdas()
    .app({
      appName,
      programs,
    });

  
  // const developerWhitelistProof = ju
  //   .core()
  //   .pdas()
  //   .developer({
  //     authority,
  //     programs,
  //   });

  return (
    TransactionBuilder.make<CreateAppBuilderContext>()
      .setFeePayer(payer)
      .setContext({
        appAddress: appPda,
      })

      // Create and initialize the App account.
      .add({
        instruction: createInitializeAppInstruction(
          {
            app: appPda,
            developerWhitelistProof: toOptionalAccount(),
            registeringProcessorPda: toOptionalAccount(externalProcessors.registeringProcessor),
            connectingProcessorPda: toOptionalAccount(externalProcessors.connectingProcessor),
            publishingProcessorPda: toOptionalAccount(externalProcessors.publishingProcessor),
            collectingProcessorPda: toOptionalAccount(externalProcessors.collectingProcessor),
            referencingProcessorPda: toOptionalAccount(externalProcessors.referencingProcessor),
            authority,
          },
          {
            appName,
            data
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'createApp',
      })
  );
};