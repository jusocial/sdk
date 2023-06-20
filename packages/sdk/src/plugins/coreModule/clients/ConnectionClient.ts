import {
  FindAllConnectionsByKeyListInput,
  findAllConnectionsByKeyListOperation,
  FindAllConnectionsInput,
  findAllConnectionsOperation,
  createConnectionOperation,
  updateConnectionOperation,
  deleteConnectionOperation,
} from '../operations';
import { Profile, Subspace } from '../models';
import type { Ju } from '@/Ju';
import { OperationOptions, PublicKey } from '@/types';

/**
 * This client helps to interact with the Ju Aplication Connections.
 *
 * You may access this client via the `core()` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const connectionClient = ju.core().connection;
 * ```
 *
 * @see {@link CoreClient} The `Core` client
 * @group Modules
 */
export class ConnectionClient {

  constructor(readonly ju: Ju) { }

  /**
   * Creates new Connection with Targer entity.
   * @param {Profile | Subspace} target - The given Profile or Subspace instance
   * @param {string} externalProcessingData - The optional data to possyble pass into connecting processor
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<SendAndConfirmTransactionResponse>} The response of the Connection creation.
   */
  create(
    target: Profile | Subspace,
    externalProcessingData?: string,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(createConnectionOperation(
        {
          app: target.app,
          target: target.address,
          externalProcessingData
        }
      ),
        options
      );
  }

  /**
   * Update existing Connection by given instance.
   * @param {Profile} initializer - The given Profile instance
   * @param {PublicKey} target - The given Profile or Subspace PublicKey
   * @param {boolean} approveStatus - The approve status to set
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<SendAndConfirmTransactionResponse>} The response of the Connection creation.
   */
  update(
    initializer: Profile,
    target: PublicKey,
    approveStatus: boolean,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(updateConnectionOperation(
        {
          app: initializer.app,
          initializer: initializer.address,
          target,
          approveStatus
        }
      ), options);
  }

  /**
   * Delete existing Connection by Target given.
   * @param {Profile | Subspace} target - The given Profile or Subspace instance
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<SendAndConfirmTransactionResponse>} The response of the Connection creation.
   */
  delete(
    target: Profile | Subspace,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(deleteConnectionOperation(
        {
          app: target.app,
          target: target.address,
        }
      ), options);
  }

  /** {@inheritDoc findAllConnectionsOperation} */
  keysByFilter(
    input: FindAllConnectionsInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllConnectionsOperation(input), options);
  }

  /** {@inheritDoc findAllConnectionsByKeyListOperation} */
  findByKeyList(
    input: FindAllConnectionsByKeyListInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllConnectionsByKeyListOperation(input), options);
  }

}