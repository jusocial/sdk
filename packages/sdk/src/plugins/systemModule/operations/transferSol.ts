import { PublicKey, SystemProgram } from '@solana/web3.js';
import { SendAndConfirmTransactionResponse } from '../../rpcModule';
import type { Ju } from '@/Ju';
import {
  assertSol,
  Operation,
  OperationHandler,
  OperationScope,
  Signer,
  SolAmount,
  useOperation,
} from '@/types';
import { TransactionBuilder, TransactionBuilderOptions } from '@/utils';

// -----------------
// Operation
// -----------------

const Key = 'TransferSolOperation' as const;

/**
 * Transfers some SOL from one account to another.
 *
 * ```ts
 * await ju
 *   .system()
 *   .transferSol({
 *     to: new PublicKey("..."),
 *     amount: sol(1.5),
 *   };
 * ````
 *
 * @group Operations
 * @category Constructors
 */
export const transferSolOperation = useOperation<TransferSolOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type TransferSolOperation = Operation<
  typeof Key,
  TransferSolInput,
  TransferSolOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type TransferSolInput = {
  /**
   * The account that sends the SOLs as a Signer.
   *
   * @defaultValue `ju.identity()`
   */
  from?: Signer;

  /** The address of the account that receives the SOLs. */
  to: PublicKey;

  /** The amount of SOLs to send. */
  amount: SolAmount;

  /**
   * Base public key to use to derive the funding account address.
   *
   * @defaultValue Defaults to not being used.
   */
  basePubkey?: PublicKey;

  /**
   * Seed to use to derive the funding account address.
   *
   * @defaultValue Defaults to not being used.
   */
  seed?: string;
};

/**
 * @group Operations
 * @category Outputs
 */
export type TransferSolOutput = {
  /** The blockchain response from sending and confirming the transaction. */
  response: SendAndConfirmTransactionResponse;
};

/**
 * @group Operations
 * @category Handlers
 */
export const transferSolOperationHandler: OperationHandler<TransferSolOperation> =
  {
    async handle(
      operation: TransferSolOperation,
      ju: Ju,
      scope: OperationScope
    ): Promise<TransferSolOutput> {
      const builder = transferSolBuilder(ju, operation.input, scope);
      return builder.sendAndConfirm(ju, scope.confirmOptions);
    },
  };

// -----------------
// Builder
// -----------------

/**
 * @group Transaction Builders
 * @category Inputs
 */
export type TransferSolBuilderParams = Omit<
  TransferSolInput,
  'confirmOptions'
> & {
  /** A key to distinguish the instruction that transfers some SOL. */
  instructionKey?: string;
};

/**
 * Transfers some SOL from one account to another.
 *
 * ```ts
 * const transactionBuilder = ju
 *   .system()
 *   .builders()
 *   .transferSol({
 *     to: new PublicKey("..."),
 *     amount: sol(1.5),
 *   });
 * ````
 *
 * @group Transaction Builders
 * @category Constructors
 */
export const transferSolBuilder = (
  ju: Ju,
  params: TransferSolBuilderParams,
  options: TransactionBuilderOptions = {}
): TransactionBuilder => {
  const { programs, payer = ju.rpc().getDefaultFeePayer() } = options;
  const { from = ju.identity(), to, amount, basePubkey, seed } = params;

  assertSol(amount);

  return TransactionBuilder.make()
    .setFeePayer(payer)
    .add({
      instruction: SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: amount.basisPoints.toNumber(),
        ...(basePubkey ? { basePubkey, seed } : {}),
        programId: ju.programs().getSystem(programs).address,
      }),
      signers: [from],
      key: params.instructionKey ?? 'transferSol',
    });
};
