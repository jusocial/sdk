import { PublicationData } from '@ju-protocol/ju-core';
import {
  
  findPublicationByAddressOperation,
  CreatePublicationInput,
  createPublicationOperation,
  updatePublicationOperation,
  deletePublicationOperation,
} from '../operations';
import {
  collectPublicationOperation,
  FindPublicationsAsKeysInput,
  findPublicationsAsKeysOperation,
  FindPublicationsByKeyListInput,
  findPublicationsByKeyListOperation,
  FindPublicationsInput,
  findPublicationsOperation
} from '../operations/publication';
import { Publication } from '../models';
import type { Ju } from '@/Ju';
import { OperationOptions, PublicKey } from '@/types';
import { ExternalProcessors } from '../types';

/**
 * This client helps to interact with the Ju Publications.
 *
 * You may access this client via the `core()` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const publicationClient = ju.core().publications(app);
 * ```
 *
 * @see {@link CoreClient} The `Core` client
 * @group Modules
 */
export class PublicationClient {

  constructor(readonly ju: Ju, readonly app: PublicKey) {}

  /**
   * Get the Publication instance by address (public key).
   * @param {PublicKey} address - The Publication address
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<Publication>} The Publication instance.
   */
  getPublication(
    address: PublicKey,
    loadJsonMetadata = true,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findPublicationByAddressOperation(
        {
          publication: address,
          loadJsonMetadata
        },
      ),
        options
      );
  }

  /** {@inheritDoc createPublicationOperation} */
  createPublication(
    input: Omit<CreatePublicationInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(createPublicationOperation(
        {
          app: this.app,
          ...input
        }
      ), options);
  }

  /**
   * Update the Publication data.
   * @param {Publication} publication - The instance of the current Publication
   * @param {Omit<Partial<PublicationArgs>, 'app'>} data - The Publication data to update.
   * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<Publication>} Updated Publication instance.
   */
  updatePublication(
    publication: Publication,
    data: Omit<Partial<PublicationData>, 'app'> & Pick<Partial<ExternalProcessors>, 'collectingProcessor' | 'referencingProcessor'>,
    loadJsonMetadata = true,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(updatePublicationOperation(
        {
          app: publication.app,
          publication: publication.address,
          data: {
            isEncrypted: data.isEncrypted === undefined ? publication.isEncrypted : data.isEncrypted,
            metadataUri: data.metadataUri === undefined ? publication.metadataUri : data.metadataUri,
            isMirror: publication.isMirror,
            isReply: publication.isReply,
            contentType: data.contentType === undefined ? publication.contentType : data.contentType,
            tag: data.tag === undefined ? publication.tag : data.tag,
          },

          externalProcessors: {
            collectingProcessor: data?.collectingProcessor === undefined ? publication.collectingProcessor : data?.collectingProcessor,
            referencingProcessor: data?.referencingProcessor === undefined ? publication.referencingProcessor : data?.referencingProcessor,
          },

          loadJsonMetadata
        }
      ),
        options
      );
  }

  /**
   * Collect the given Publication.
   * @param {PublicKey} publication - The Publication address
   * @param {string} externalProcessingData - The optional data to possyble pass into collecting processor
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<SendAndConfirmTransactionResponse>} The Publication delete responce.
   */
  collectPublication(
    publication: PublicKey,
    externalProcessingData?: string,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(collectPublicationOperation(
        {
          app: this.app,
          publication,
          externalProcessingData,
        }
      ),
        options
      );
  }

  /**
   * Delete the given Publication.
   * @param {PublicKey} publication - The Publication address
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<SendAndConfirmTransactionResponse>} The Publication delete responce.
   */
  deletePublication(
    publication: PublicKey,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(deletePublicationOperation(
        {
          app: this.app,
          publication
        }
      ),
        options
      );
  }

  /** {@inheritDoc findPublicationsOperation} */
  findPublications(
    filter: FindPublicationsInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findPublicationsOperation(
        {
          app: (filter.profile || filter.subspace || filter.targetPublication) ? undefined : this.app,
          ...filter
        }
      ), options);
  }

  /** {@inheritDoc findPublicationsOperation} */
  findPublicationsAsKeys(
    filter: FindPublicationsAsKeysInput,
    options?: OperationOptions
  ): Promise<PublicKey[]> {
    return this.ju
      .operations()
      .execute(findPublicationsAsKeysOperation(
        {
          app: (filter.profile || filter.subspace || filter.targetPublication) ? undefined : this.app,
          ...filter
        }
      ), options);
  }

  /** {@inheritDoc findPublicationsByKeyListOperation} */
  getPublicationsByKeyList(
    input: FindPublicationsByKeyListInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findPublicationsByKeyListOperation(input), options);
  }

  
}