import { SubspaceData, SubspaceManagementRoleType } from '@ju-protocol/ju-core';
import {
  FindSubspacesInput,
  findSubspacesOperation,
  FindSubspacesByKeyListInput,
  findSubspacesByKeyListOperation,
  findSubspaceByAddressOperation,
  CreateSubspaceInput,
  createSubspaceOperation,
  updateSubspaceOperation,
  deleteSubspaceOperation,
  FindSubspacesAsKeysByConnectionTargetInput,
  findSubspacesAsKeysByConnectionTargetOperation,
  FindSubspacesAsKeysByConnectionInitializerInput,
  findSubspacesAsKeysByConnectionInitializerOperation,
  findSubspacesAsKeysOperation,
  FindSubspacesAsKeysInput,
} from '../operations';
import { Subspace } from '../models';
import { addSubspaceManagerOperation } from '../operations/subspace/addSubspaceManager';
import { deleteSubspaceManagerOperation } from '../operations/subspace/deleteSubspaceManager';
import { updateSubspaceManagerOperation } from '../operations/subspace/updateSubspaceManager';
import { FindSubspaceManagersInput, findSubspaceManagersOperation } from '../operations/subspace/findSubspaceManagers';
import { ExternalProcessors } from '../types';
import type { Ju } from '@/Ju';
import { OperationOptions, PublicKey } from '@/types';

/**
 * This client helps to interact with the Ju Aplication Subspaces.
 *
 * You may access this client via the `core().subspaces(app)` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const subspaceClient = ju.core().subspaces(app);
 * ```
 *
 * @see {@link CoreClient} The `Core` client
 * @group Modules
 */
export class SubspaceClient {

  constructor(readonly ju: Ju, readonly app: PublicKey) { }

  /**
  * Get the Subspace instance by address (public key).
  * @param {PublicKey} address - The Subspace address
  * @param {boolean} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
  * @param {OperationOptions} options - The optional operation options
  * @returns {Promise<Subspace>} The Subspace instance.
  */
  getSubspace(
    address: PublicKey,
    loadJsonMetadata = true,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findSubspaceByAddressOperation(
        {
          subspace: address,
          loadJsonMetadata
        },
      ),
        options
      );
  }

  /** {@inheritDoc createSubspaceOperation} */
  createSubspace(
    input: Omit<CreateSubspaceInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(createSubspaceOperation(
        {
          app: this.app,
          ...input
        }
      ), options);
  }

  /**
   * Update the Subspace data.
   * @param {Subspace} subspace - The instance of the current Subspace
   * @param {Partial<SubspaceArgs>} data - The Subspace data to update.
   * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<Subspace>} Updated Subspace instance.
   */
  updateSubspace(
    subspace: Subspace,
    data: Omit<Partial<SubspaceData>, 'app'> & Pick<Partial<ExternalProcessors>, 'connectingProcessor' | 'publishingProcessor' | 'collectingProcessor' | 'referencingProcessor'>,
    loadJsonMetadata = true,
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
            publishingPermission: data.publishingPermission === undefined ? subspace.publishingPermission : data.publishingPermission,
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
   * @param {PublicKey} subspace - The Subspace address
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<SendAndConfirmTransactionResponse>} The Subspace delete responce.
   */
  deleteSubspace(
    subspace: PublicKey,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(deleteSubspaceOperation(
        {
          app: this.app,
          subspace
        }
      ),
        options
      );
  }

  /**
   * Add new Subspace Manager.
   * @param {PublicKey} subspace - The Subspace address
   * @param {PublicKey} profile - The Profile address
   * @param {PublSubspaceManagementRoleTypeicKey} role - Manager Role valiant
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<AddSubspaceManagerOutput>} Add new Subspace Manager output.
   */
  addManager(
    subspace: PublicKey,
    profile: PublicKey,
    role: SubspaceManagementRoleType,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(addSubspaceManagerOperation(
        {
          app: this.app,
          subspace,
          profile,
          role
        }
      ),
        options
      );
  }

  /**
   * Add new Subspace Manager.
   * @param {PublicKey} subspace - The Subspace address
   * @param {PublicKey} profile - The Profile address
   * @param {PublSubspaceManagementRoleTypeicKey} role - Manager Role valiant
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<UpdateSubspaceManagerOutput>} Update Subspace Manager output.
   */
  updateManager(
    subspace: PublicKey,
    profile: PublicKey,
    role: SubspaceManagementRoleType,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(updateSubspaceManagerOperation(
        {
          app: this.app,
          subspace,
          profile,
          role
        }
      ),
        options
      );
  }

  /**
   * Delete existing Subspace Manager.
   * @param {PublicKey} subspace - The Subspace address
   * @param {PublicKey} profile - The Profile address
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<DeleteSubspaceManagerOutput>} Delete Subspace Manager output.
   */
  deleteManager(
    subspace: PublicKey,
    profile: PublicKey,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(deleteSubspaceManagerOperation(
        {
          app: this.app,
          subspace,
          profile
        }
      ),
        options
      );
  }

   /** {@inheritDoc findSubspaceManagersOperation} */
  findManagers(
    filter: Omit<FindSubspaceManagersInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findSubspaceManagersOperation(
        {
          app: this.app,
          ...filter
        }
      ), options);
  }

  /** {@inheritDoc findSubspacesOperation} */
  findSubspaces(
    filter: Omit<FindSubspacesInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findSubspacesOperation(
        {
          app: this.app,
          ...filter
        }
      ), options);
  }

  /** {@inheritDoc findSubspacesOperation} */
  findSubspacesAsKeys(
    filter: Omit<FindSubspacesAsKeysInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findSubspacesAsKeysOperation(
        {
          app: this.app,
          ...filter
        }
      ), options);
  }

  /** {@inheritDoc findSubspacesByConnectionTargetOperation} */
  findSubspacesAsKeysByConnectionTarget(
    input: Omit<FindSubspacesAsKeysByConnectionTargetInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findSubspacesAsKeysByConnectionTargetOperation(
        {
          app: this.app,
          ...input
        }
      ), options);
  }

  /** {@inheritDoc findSubspacesByConnectionInitializerOperation} */
  findSubspacesAsKeysByConnectionInitializer(
    input: Omit<FindSubspacesAsKeysByConnectionInitializerInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findSubspacesAsKeysByConnectionInitializerOperation(
        {
          app: this.app,
          ...input
        }
      ), options);
  }

  /** {@inheritDoc findSubspacesByKeyListOperation} */
  getSubspacesByKeyList(
    input: FindSubspacesByKeyListInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findSubspacesByKeyListOperation(input), options);
  }

}