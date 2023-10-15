import { AppArgs } from '@ju-protocol/ju-core';
import {
  CreateAppInput,
  createAppOperation,
  findAppsOperation,
  findAppByAddressOperation,
  updateAppOperation,
  FindAppsInput,
} from '../operations';
import { App } from '../models';
import { FindAppsByKeyListInput, findAppsByKeyListOperation } from '../operations/app/findAppsByKeyList';
import { FindAppsAsKeysInput, findAppsAsKeysOperation } from '../operations/app/findAppsAsKeys';
import type { Ju } from '@/Ju';
import { OperationOptions, PublicKey } from '@/types';

/**
 * This client helps to interact with the Ju Aplications.
 *
 * You may access this client via the `core().apps()` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const appClient = ju.core().apps();
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
  getApp(
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
  createApp(
    input: CreateAppInput,
    options?: OperationOptions
  ) {
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
  updateApp(
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

            profileMetadataRequired: data.profileMetadataRequired === undefined ? app.profileMetadataRequired : data.profileMetadataRequired,
            subspaceMetadataRequired: data.subspaceMetadataRequired === undefined ? app.subspaceMetadataRequired : data.subspaceMetadataRequired,

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

  /** {@inheritDoc findAppsOperation} */
  findApps(
    input: FindAppsInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAppsOperation(input), options);
  }

  /** {@inheritDoc findAppsAsKeysOperation} */
  findAppsAsKeys(
    input: FindAppsAsKeysInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAppsAsKeysOperation(input), options);
  }

  /** {@inheritDoc findAppsByKeyListOperation} */
  getAppsByKeyList(
    input: FindAppsByKeyListInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAppsByKeyListOperation(input), options);
  }

}