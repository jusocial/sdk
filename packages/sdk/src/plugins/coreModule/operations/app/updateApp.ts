import {
  AppData,
  createUpdateAppInstruction
} from '@ju-protocol/ju-core';
import { PublicKey } from '@solana/web3.js';
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
  toPublicKey,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';

// -----------------
// Operation
// -----------------

const Key = 'UpdateAppOperation' as const;

/**
 * Uodates an existing Application.
 *
 * ```ts
 * await ju
 *   .core()
 *   .updateApp(
 *      {
 *        app: JP8sM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUQgT,
 *        data: {},
 *        externalProcessors: {}
 *      }
 *    );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const updateAppOperation =
  useOperation<UpdateAppOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type UpdateAppOperation = Operation<
  typeof Key,
  UpdateAppInput,
  UpdateAppOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type UpdateAppInput = {
  /** The address of the App. */
  app: PublicKey;

  /** App Instruction data */
  data: AppData;

  /** External Processors. */
  externalProcessors: ExternalProcessors;
};

/**
 * @group Operations
 * @category Outputs
 */
export type UpdateAppOutput = {
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
export const updateAppOperationHandler: OperationHandler<UpdateAppOperation> =
{
  async handle(
    operation: UpdateAppOperation,
    ju: Ju,
    scope: OperationScope
  ): Promise<UpdateAppOutput> {
    const builder = updateAppBuilder(
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

    const retrievedApp = await ju.core().apps().getApp(
      output.appAddress,
      scope
    );

    // if (!retrievedApp) {
    //   // TO-DO
    //   throw ('Error: App not found')
    // }

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
export type UpdateAppBuilderParams = Omit<
  UpdateAppInput,
  'confirmOptions'
> & {
  instructionKey?: string;
};;

/**
 * @group Transaction Builders
 * @category Contexts
 */
export type UpdateAppBuilderContext = Omit<
  UpdateAppOutput,
  'response' | 'app'
>;

/**
 * Updates an App.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .app()
 *   .builders()
 *   .updateApp({ name: "jutube", metadataUri: "https://arweave.net/xxx" })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const updateAppBuilder = (
  ju: Ju,
  params: UpdateAppBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder<UpdateAppBuilderContext> => {
  // Data.
  const { payer = ju.rpc().getDefaultFeePayer() } = options;

  const { 
    app,
    data,
    externalProcessors
   } = params;

  // Accounts.
  const authority = ju.identity();

  return (
    TransactionBuilder.make<UpdateAppBuilderContext>()
      .setFeePayer(payer)
      .setContext({
        appAddress: app
      })

      // Create and initialize the App account.
      .add({
        instruction: createUpdateAppInstruction(
          {
            app,
            registeringProcessorPda: toOptionalAccount(externalProcessors.registeringProcessor),
            connectingProcessorPda: toOptionalAccount(externalProcessors.connectingProcessor),
            publishingProcessorPda: toOptionalAccount(externalProcessors.publishingProcessor),
            collectingProcessorPda: toOptionalAccount(externalProcessors.collectingProcessor),
            referencingProcessorPda: toOptionalAccount(externalProcessors.referencingProcessor),
            authority: toPublicKey(authority),
          },
          {
            data
          }
        ),
        signers: [payer],
        key: params.instructionKey ?? 'updateApp',
      })
  );
};