// @ts-ignore
import { Buffer } from 'buffer';
import {
  AccountInfo,
  Blockhash,
  BlockhashWithExpiryBlockHeight,
  Commitment,
  ConfirmOptions,
  GetLatestBlockhashConfig,
  GetProgramAccountsConfig,
  PublicKey,
  RpcResponseAndContext,
  SendOptions,
  SignatureResult,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js';
import {
  FailedToConfirmTransactionError,
  FailedToConfirmTransactionWithResponseError,
  FailedToSendTransactionError,
  JuError,
  ParsedProgramError,
  UnknownProgramError,
} from '@/errors';
import type { Ju } from '@/Ju';
import {
  assertSol,
  getSignerHistogram,
  isErrorWithLogs,
  lamports,
  Program,
  Signer,
  SolAmount,
  UnparsedAccount,
  UnparsedMaybeAccount,
} from '@/types';
import { TransactionBuilder, zipMap } from '@/utils';

export type ConfirmTransactionResponse = RpcResponseAndContext<SignatureResult>;
export type SendAndConfirmTransactionResponse = {
  signature: TransactionSignature;
  confirmResponse: ConfirmTransactionResponse;
  blockhash: Blockhash;
  lastValidBlockHeight: number;
};

/**
 * @group Modules
 */
export class RpcClient {
  protected defaultFeePayer?: Signer;

  constructor(protected readonly ju: Ju) {}

  protected async prepareTransaction(
    transaction: Transaction | TransactionBuilder,
    signers: Signer[]
  ): Promise<{
    transaction: Transaction;
    signers: Signer[];
    blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
  }> {
    let blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
    if (
      !('records' in transaction) &&
      transaction.recentBlockhash &&
      transaction.lastValidBlockHeight
    ) {
      blockhashWithExpiryBlockHeight = {
        blockhash: transaction.recentBlockhash,
        lastValidBlockHeight: transaction.lastValidBlockHeight,
      };
    } else {
      blockhashWithExpiryBlockHeight = await this.getLatestBlockhash();
    }

    if ('records' in transaction) {
      signers = [...transaction.getSigners(), ...signers];
      transaction = transaction.toTransaction(blockhashWithExpiryBlockHeight);
    }

    return { transaction, signers, blockhashWithExpiryBlockHeight };
  }

  async signTransaction(
    transaction: Transaction,
    signers: Signer[]
  ): Promise<Transaction> {
    const { keypairs, identities } = getSignerHistogram(signers);

    // Keypair signers.
    if (keypairs.length > 0) {
      transaction.partialSign(...keypairs);
    }

    // Identity signers.
    for (let i = 0; i < identities.length; i++) {
      transaction = await identities[i].signTransaction(transaction);
    }

    return transaction;
  }

  async sendTransaction(
    transaction: Transaction | TransactionBuilder,
    sendOptions: SendOptions = {},
    signers: Signer[] = []
  ): Promise<TransactionSignature> {
    const prepared = await this.prepareTransaction(transaction, signers);
    transaction = prepared.transaction;
    signers = prepared.signers;

    const defaultFeePayer = this.getDefaultFeePayer();
    if (!transaction.feePayer && defaultFeePayer) {
      transaction.feePayer = defaultFeePayer.publicKey;
      signers = [defaultFeePayer, ...signers];
    }

    transaction = await this.signTransaction(transaction, signers);
    const rawTransaction = transaction.serialize();

    try {
      return await this.ju.connection.sendRawTransaction(
        rawTransaction,
        sendOptions
      );
    } catch (error) {
      throw this.parseProgramError(error, transaction);
    }
  }

  async confirmTransaction(
    signature: TransactionSignature,
    blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight,
    commitment?: Commitment
  ): Promise<ConfirmTransactionResponse> {
    let rpcResponse: ConfirmTransactionResponse;
    try {
      rpcResponse = await this.ju.connection.confirmTransaction(
        { signature, ...blockhashWithExpiryBlockHeight },
        commitment
      );
    } catch (error) {
      throw new FailedToConfirmTransactionError(error as Error);
    }

    if (rpcResponse.value.err) {
      throw new FailedToConfirmTransactionWithResponseError(rpcResponse);
    }

    return rpcResponse;
  }

  async sendAndConfirmTransaction(
    transaction: Transaction | TransactionBuilder,
    confirmOptions?: ConfirmOptions,
    signers: Signer[] = []
  ): Promise<SendAndConfirmTransactionResponse> {
    const prepared = await this.prepareTransaction(transaction, signers);
    const { blockhashWithExpiryBlockHeight } = prepared;
    transaction = prepared.transaction;
    signers = prepared.signers;

    const signature = await this.sendTransaction(
      transaction,
      confirmOptions,
      signers
    );

    const confirmResponse = await this.confirmTransaction(
      signature,
      blockhashWithExpiryBlockHeight,
      confirmOptions?.commitment
    );

    return { signature, confirmResponse, ...blockhashWithExpiryBlockHeight };
  }

  async getAccount(publicKey: PublicKey, commitment?: Commitment) {
    const accountInfo = await this.ju.connection.getAccountInfo(
      publicKey,
      commitment
    );

    return this.getUnparsedMaybeAccount(publicKey, accountInfo);
  }

  async accountExists(publicKey: PublicKey, commitment?: Commitment) {
    const balance = await this.ju.connection.getBalance(
      publicKey,
      commitment
    );

    return balance > 0;
  }

  async getMultipleAccounts(publicKeys: PublicKey[], commitment?: Commitment) {
    const accountInfos = await this.ju.connection.getMultipleAccountsInfo(
      publicKeys,
      commitment
    );

    return zipMap(publicKeys, accountInfos, (publicKey, accountInfo) => {
      return this.getUnparsedMaybeAccount(publicKey, accountInfo);
    });
  }

  async getProgramAccounts(
    programId: PublicKey,
    configOrCommitment?: GetProgramAccountsConfig | Commitment
  ): Promise<UnparsedAccount[]> {
    const accounts = await this.ju.connection.getProgramAccounts(
      programId,
      configOrCommitment
    );

    return accounts.map(({ pubkey, account }) => ({
      ...account,
      publicKey: pubkey,
      lamports: lamports(account.lamports),
    }));
  }

  async airdrop(
    publicKey: PublicKey,
    amount: SolAmount,
    commitment?: Commitment
  ): Promise<SendAndConfirmTransactionResponse> {
    assertSol(amount);

    const signature = await this.ju.connection.requestAirdrop(
      publicKey,
      amount.basisPoints.toNumber()
    );

    const blockhashWithExpiryBlockHeight = await this.getLatestBlockhash();
    const confirmResponse = await this.confirmTransaction(
      signature,
      blockhashWithExpiryBlockHeight,
      commitment
    );

    return { signature, confirmResponse, ...blockhashWithExpiryBlockHeight };
  }

  async getBalance(
    publicKey: PublicKey,
    commitment?: Commitment
  ): Promise<SolAmount> {
    const balance = await this.ju.connection.getBalance(
      publicKey,
      commitment
    );

    return lamports(balance);
  }

  async getRent(bytes: number, commitment?: Commitment): Promise<SolAmount> {
    const rent =
      await this.ju.connection.getMinimumBalanceForRentExemption(
        bytes,
        commitment
      );

    return lamports(rent);
  }

  async getLatestBlockhash(
    commitmentOrConfig: Commitment | GetLatestBlockhashConfig = 'finalized'
  ): Promise<BlockhashWithExpiryBlockHeight> {
    return this.ju.connection.getLatestBlockhash(commitmentOrConfig);
  }

  getSolanaExplorerUrl(signature: string): string {
    let clusterParam = '';
    switch (this.ju.cluster) {
      case 'devnet':
        clusterParam = '?cluster=devnet';
        break;
      case 'testnet':
        clusterParam = '?cluster=testnet';
        break;
      case 'localnet':
      case 'custom':
        const url = encodeURIComponent(this.ju.connection.rpcEndpoint);
        clusterParam = `?cluster=custom&customUrl=${url}`;
        break;
    }

    return `https://explorer.solana.com/tx/${signature}${clusterParam}`;
  }

  setDefaultFeePayer(payer: Signer) {
    this.defaultFeePayer = payer;

    return this;
  }

  getDefaultFeePayer(): Signer {
    return this.defaultFeePayer
      ? this.defaultFeePayer
      : this.ju.identity();
  }

  protected getUnparsedMaybeAccount(
    publicKey: PublicKey,
    accountInfo: AccountInfo<Buffer> | null
  ): UnparsedMaybeAccount {
    if (!accountInfo) {
      return { publicKey, exists: false };
    }

    return {
      ...accountInfo,
      publicKey,
      exists: true,
      lamports: lamports(accountInfo.lamports),
    };
  }

  protected parseProgramError(
    error: unknown,
    transaction: Transaction
  ): JuError {
    // Ensure the error as logs.
    if (!isErrorWithLogs(error)) {
      return new FailedToSendTransactionError(error as Error);
    }

    // Parse the instruction number.
    const regex = /Error processing Instruction (\d+):/;
    const instruction: string | null = error.message.match(regex)?.[1] ?? null;

    // Ensure there is an instruction number given to find the program.
    if (!instruction) {
      return new FailedToSendTransactionError(error);
    }

    // Get the program ID from the instruction in the transaction.
    const instructionNumber: number = parseInt(instruction, 10);
    const programId: PublicKey | null =
      transaction.instructions?.[instructionNumber]?.programId ?? null;

    // Ensure we were able to find a program ID for the instruction.
    if (!programId) {
      return new FailedToSendTransactionError(error);
    }

    // Find a registered program if any.
    let program: Program;
    try {
      program = this.ju.programs().get(programId);
    } catch (_programNotFoundError) {
      return new FailedToSendTransactionError(error);
    }

    // Ensure an error resolver exists on the program.
    if (!program.errorResolver) {
      return new UnknownProgramError(program, error);
    }

    // Finally, resolve the error.
    const resolvedError = program.errorResolver(error);

    return resolvedError
      ? new ParsedProgramError(program, resolvedError, error.logs)
      : new UnknownProgramError(program, error);
  }
}
