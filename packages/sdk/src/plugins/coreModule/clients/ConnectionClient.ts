import {
  FindConnectionsByKeyListInput,
  findConnectionsByKeyListOperation,
  FindConnectionsInput,
  findConnectionsOperation,
  createConnectionOperation,
  updateConnectionOperation,
  deleteConnectionOperation,
  findConnectionsAsKeysOperation,
  FindConnectionsAsKeysInput,
} from '../operations';
import type { Ju } from '@/Ju';
import { OperationOptions, PublicKey } from '@/types';

/**
 * This client helps to interact with the Ju Aplication Connections.
 *
 * You may access this client via the `core().connections(app)` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const connectionClient = ju.core().connections(app);
 * ```
 *
 * @see {@link CoreClient} The `Core` client
 * @group Modules
 */
export class ConnectionClient {

  constructor(readonly ju: Ju, readonly app: PublicKey) { }

  /**
   * Creates new Connection with Targer entity.
   * @param {PublicKey} target - The given Target (Profile or Subspace) Public Key
   * @param {string} externalProcessingData - The optional data to possyble pass into connecting processor
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<SendAndConfirmTransactionResponse>} The response of the Connection creation.
   */
  createConnection(
    target: PublicKey,
    externalProcessingData?: string,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(createConnectionOperation(
        {
          app: this.app,
          target,
          externalProcessingData
        }
      ),
        options
      );
  }

  /**
   * Update existing Connection by given instance.
   * @param {PublicKey} initializer - The given Profile Public Key
   * @param {PublicKey} target - The given Profile or Subspace PublicKey
   * @param {boolean} approveStatus - The approve status to set
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<SendAndConfirmTransactionResponse>} The response of the Connection creation.
   */
  updateConnection(
    initializer: PublicKey,
    target: PublicKey,
    approveStatus: boolean,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(updateConnectionOperation(
        {
          app: this.app,
          initializer,
          target,
          approveStatus
        }
      ), options);
  }

  /**
   * Delete existing Connection by Target given.
   * @param {PublicKey} target - The given Target (Profile or Subspace) Public key
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<SendAndConfirmTransactionResponse>} The response of the Connection creation.
   */
  deleteConnection(
    target: PublicKey,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(deleteConnectionOperation(
        {
          app: this.app,
          target,
        }
      ), options);
  }

  /** {@inheritDoc findConnectionsOperation} */
  findConnections(
    filter: Omit<FindConnectionsInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findConnectionsOperation(
        {
          app: this.app,
          ...filter
        }
      ), options);
  }


  /** {@inheritDoc findConnectionsOperation} */
  findConnectionsAsKeys(
    filter: Omit<FindConnectionsAsKeysInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findConnectionsAsKeysOperation(
        {
          app: this.app,
          ...filter
        }
      ), options);
  }

  /** {@inheritDoc findConnectionsByKeyListOperation} */
  getConnectionsByKeyList(
    input: FindConnectionsByKeyListInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findConnectionsByKeyListOperation(input), options);
  }

  /**
   * Checks if Connection on Initializer and Target exist.
   * @param {PublicKey} initializer - The initializer PublicKey
   * @param {PublicKey} target - The given Target entity PublicKey
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<boolean>} Promise boolean
   */
  async isConnectionExist(
    initializer: PublicKey,
    target: PublicKey,
    options?: OperationOptions
  ) {
    const connectionPda = this.ju.core().pdas().connection(
      {
        app: this.app,
        target,
        initializer
      }
    )

    return await this.ju.rpc().accountExists(connectionPda, options?.commitment);
  }

}