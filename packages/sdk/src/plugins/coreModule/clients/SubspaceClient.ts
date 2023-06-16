import { SubspaceArgs } from '@ju-protocol/ju-core';
import {
  FindAllSubspacesInput,
  findAllSubspacesOperation,
  FindAllSubspacesByKeyListInput,
  findAllSubspacesByKeyListOperation,
  findSubspaceByAddressOperation,
  CreateSubspaceInput,
  createSubspaceOperation,
  updateSubspaceOperation,
  deleteSubspaceOperation,
  FindAllSubspacesByConnectionTargetInput,
  findAllSubspacesByConnectionTargetOperation,
  FindAllSubspacesByConnectionInitializerInput,
  findAllSubspacesByConnectionInitializerOperation,
} from '../operations';
import { Subspace } from '../models';
import type { Ju } from '@/Ju';
import { OperationOptions, PublicKey } from '@/types';

/**
 * This client helps to interact with the Ju Aplication Subspaces.
 *
 * You may access this client via the `core()` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const subspaceClient = ju.core().subspace;
 * ```
 *
 * @see {@link Core} The `Core` model
 * @group Modules
 */
export class SubspaceClient {

  constructor(readonly ju: Ju) { }

  /**
   * Get the Subspace instance by address (public key).
   * @param {PublicKey} address - The Subspace address
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<Subspace>} The Subspace instance.
   */
  get(
    address: PublicKey,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findSubspaceByAddressOperation(
        {
          subspace: address,
          loadJsonMetadata: true
        },
      ),
        options
      );
  }

  /** {@inheritDoc createSubspaceOperation} */
  create(input: CreateSubspaceInput, options?: OperationOptions) {
    return this.ju
      .operations()
      .execute(createSubspaceOperation(input), options);
  }

  /**
   * Update the Subspace data.
   * @param {Subspace} subspace - The instance of the current Subspace
   * @param {Partial<SubspaceArgs>} data - The Subspace data to update.
   * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<Subspace>} Updated Subspace instance.
   */
  update(
    subspace: Subspace,
    data: Partial<SubspaceArgs>,
    loadJsonMetadata?: boolean,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(updateSubspaceOperation(
        {
          app: subspace.app,
          subspace: subspace.address,
          data: {
            alias: data.alias === undefined ? subspace.alias : data.alias,
            name: data.name === undefined ? subspace.name : data.name,
            metadataUri: data.metadataUri === undefined ? subspace.metadataUri : data.metadataUri,
          },
          currentAlias: subspace.alias,

          externalProcessors: {
            connectingProcessor: data.connectingProcessor === undefined ? subspace.connectingProcessor : data.connectingProcessor,
            publishingProcessor: data.publishingProcessor === undefined ? subspace.publishingProcessor : data.publishingProcessor,
            collectingProcessor: data.collectingProcessor === undefined ? subspace.collectingProcessor : data.collectingProcessor,
            referencingProcessor: data.referencingProcessor === undefined ? subspace.referencingProcessor : data.referencingProcessor
          },

          loadJsonMetadata
        }
      ),
        options
      );
  }

  /**
   * Delete the given Subspace.
   * @param {Publication} subspace - The Subspace address
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<SendAndConfirmTransactionResponse>} The Subspace delete responce.
   */
  delete(
    subspace: Subspace,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(deleteSubspaceOperation(
        {
          app: subspace.app,
          subspace: subspace.address
        }
      ),
        options
      );
  }

  /** {@inheritDoc findAllSubspacesOperation} */
  keysByFilter(
    input: FindAllSubspacesInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllSubspacesOperation(input), options);
  }

  /** {@inheritDoc findAllSubspacesByConnectionTargetOperation} */
  findByConnectionTarget(
    input: FindAllSubspacesByConnectionTargetInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllSubspacesByConnectionTargetOperation(input), options);
  }

  /** {@inheritDoc findAllSubspacesByConnectionInitializerOperation} */
  findByConnectionInitializer(
    input: FindAllSubspacesByConnectionInitializerInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllSubspacesByConnectionInitializerOperation(input), options);
  }

  /** {@inheritDoc findAllSubspacesByKeyListOperation} */
  findByKeyList(
    input: FindAllSubspacesByKeyListInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllSubspacesByKeyListOperation(input), options);
  }

}