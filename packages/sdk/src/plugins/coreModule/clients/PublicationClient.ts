import { PublicationArgs } from '@ju-protocol/ju-core';
import {
  findPublicationByAddressOperation,
  CreatePublicationInput,
  createPublicationOperation,
  updatePublicationOperation,
  deletePublicationOperation,
} from '../operations';
import {
  collectPublicationOperation,
  FindAllPublicationsByKeyListInput,
  findAllPublicationsByKeyListOperation,
  FindAllPublicationsInput,
  findAllPublicationsOperation
} from '../operations/publication';
import { Publication } from '../models';
import type { Ju } from '@/Ju';
import { OperationOptions, PublicKey } from '@/types';

/**
 * This client helps to interact with the Ju Publications.
 *
 * You may access this client via the `core()` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const publicationClient = ju.core();
 * ```
 *
 * @see {@link CoreClient} The `Core` client
 * @group Modules
 */
export class PublicationClient {

  constructor(readonly ju: Ju) { }

  /**
   * Get the Publication instance by address (public key).
   * @param {PublicKey} address - The Publication address
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<Publication>} The Publication instance.
   */
  get(
    address: PublicKey,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findPublicationByAddressOperation(
        {
          publication: address,
          loadJsonMetadata: true
        },
      ),
        options
      );
  }

  /** {@inheritDoc createPublicationOperation} */
  create(input: CreatePublicationInput, options?: OperationOptions) {
    return this.ju
      .operations()
      .execute(createPublicationOperation(input), options);
  }

  /**
   * Update the Publication data.
   * @param {Publication} publication - The instance of the current Publication
   * @param {Partial<PublicationArgs>} data - The Publication data to update.
   * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<Publication>} Updated Publication instance.
   */
  update(
    publication: Publication,
    data: Partial<PublicationArgs>,
    loadJsonMetadata?: boolean,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(updatePublicationOperation(
        {
          app: publication.app,
          publication: publication.address,
          data: {
            metadataUri: data.metadataUri === undefined ? publication.metadataUri : data.metadataUri,
            isMirror: publication.isMirror,
            isReply: publication.isReply,
            contentType: data.contentType === undefined ? publication.contentType : data.contentType,
            tag: data.tag === undefined ? publication.tag : data.tag,
          },

          externalProcessors: {
            collectingProcessor: data.collectingProcessor === undefined ? publication.collectingProcessor : data.collectingProcessor,
            referencingProcessor: data.referencingProcessor === undefined ? publication.referencingProcessor : data.referencingProcessor,
          },
          
          loadJsonMetadata
        }
      ),
        options
      );
  }

  /**
   * Collect the given Publication.
   * @param {Publication} publication - The Publication address
   * @param {string} externalProcessingData - The optional data to possyble pass into collecting processor
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<SendAndConfirmTransactionResponse>} The Publication delete responce.
   */
  collect(
    publication: Publication,
    externalProcessingData?: string,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(collectPublicationOperation(
        {
          app: publication.app,
          publication: publication.address,
          externalProcessingData,
        }
      ),
        options
      );
  }

  /**
   * Delete the given Publication.
   * @param {Publication} publication - The Publication address
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<SendAndConfirmTransactionResponse>} The Publication delete responce.
   */
  delete(
    publication: Publication,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(deletePublicationOperation(
        {
          app: publication.app,
          publication: publication.address
        }
      ),
        options
      );
  }

  /** {@inheritDoc findAllPublicationsOperation} */
  keysByFilter(
    input: FindAllPublicationsInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllPublicationsOperation(input), options);
  }

  /** {@inheritDoc findAllPublicationsByKeyListOperation} */
  findByKeyList(
    input: FindAllPublicationsByKeyListInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllPublicationsByKeyListOperation(input), options);
  }
}