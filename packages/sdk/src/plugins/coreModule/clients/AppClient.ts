import { AppArgs } from '@ju-protocol/ju-core';
import {
  CreateAppInput,
  createAppOperation,
  findAppByAddressOperation,
  updateAppOperation,
} from '../operations';
import { App } from '../models';
import type { Ju } from '@/Ju';
import { OperationOptions, PublicKey } from '@/types';

/**
 * This client helps to interact with the Ju Aplications.
 *
 * You may access this client via the `core()` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const appClient = ju.core().app;
 * ```
 *
 * @see {@link CoreClient} The `Core` client
 * @group Modules
 */
export class AppClient {

  constructor(readonly ju: Ju) { }

  /**
   * Get the App instance.
   * @param {PublicKey} address - The App address
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<App>} The App instance.
   */
  get(
    address: PublicKey,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAppByAddressOperation(
        {
          address,
          loadJsonMetadata: true
        },
      ), options);
  }

  /** {@inheritDoc createAppOperation} */
  create(input: CreateAppInput, options?: OperationOptions) {
    return this.ju
      .operations()
      .execute(createAppOperation(input), options);
  }

  /**
   * Update the Application data.
   * @param {App} app - The given App instance
   * @param {Partial<AppArgs>} data - The App data to update.
   * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<App>} Updated App instance.
   */
  update(
    app: App,
    data: Partial<AppArgs>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(updateAppOperation(
        {
          app: app.address,
          data: {
            metadataUri: data.metadataUri === undefined ? app.metadataUri : data.metadataUri,
            profileNameRequired: data.profileNameRequired === undefined ? app.profileNameRequired : data.profileNameRequired,
            profileSurnameRequired: data.profileSurnameRequired === undefined ? app.profileSurnameRequired : data.profileSurnameRequired,
            profileBirthdateRequired: data.profileBirthdateRequired === undefined ? app.profileBirthdateRequired : data.profileBirthdateRequired,
            profileCountryRequired: data.profileCountryRequired === undefined ? app.profileCountryRequired : data.profileCountryRequired,
            profileCityRequired: data.profileCityRequired === undefined ? app.profileCityRequired : data.profileCityRequired,
            profileMetadataUriRequired: data.profileMetadataUriRequired === undefined ? app.profileMetadataUriRequired : data.profileMetadataUriRequired,
            subspaceNameRequired: data.subspaceNameRequired === undefined ? app.subspaceNameRequired : data.subspaceNameRequired,
            subspaceMetadataUriRequired: data.subspaceMetadataUriRequired === undefined ? app.subspaceMetadataUriRequired : data.subspaceMetadataUriRequired,
            
            profileDeleteAllowed: data.profileDeleteAllowed === undefined ? app.profileDeleteAllowed : data.profileDeleteAllowed,
            subspaceDeleteAllowed: data.subspaceDeleteAllowed === undefined ? app.subspaceDeleteAllowed : data.subspaceDeleteAllowed,
            publicationDeleteAllowed: data.publicationDeleteAllowed === undefined ? app.publicationDeleteAllowed : data.publicationDeleteAllowed,

            profileIndividualProcessorsAllowed: data.profileIndividualProcessorsAllowed === undefined ? app.profileIndividualProcessorsAllowed : data.profileIndividualProcessorsAllowed,
            subspaceIndividualProcessorsAllowed: data.subspaceIndividualProcessorsAllowed === undefined ? app.subspaceIndividualProcessorsAllowed : data.subspaceIndividualProcessorsAllowed,
            publicationIndividualProcessorsAllowed: data.publicationIndividualProcessorsAllowed === undefined ? app.publicationIndividualProcessorsAllowed : data.publicationIndividualProcessorsAllowed,
          },
          externalProcessors: {
            registeringProcessor: data.registeringProcessor === undefined ? app.registeringProcessor : data.registeringProcessor,
            connectingProcessor: data.connectingProcessor === undefined ? app.connectingProcessor : data.connectingProcessor,
            publishingProcessor: data.publishingProcessor === undefined ? app.publishingProcessor : data.publishingProcessor,
            collectingProcessor: data.collectingProcessor === undefined ? app.collectingProcessor : data.collectingProcessor,
            referencingProcessor: data.referencingProcessor === undefined ? app.referencingProcessor : data.referencingProcessor
          }
        }
      ),
        options
      );
  }

}