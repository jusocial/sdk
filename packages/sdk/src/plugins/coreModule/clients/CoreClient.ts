import { PublicKey } from '@solana/web3.js';
import { CoreBuildersClient } from './CoreBuildersClient';
import { CorePdasClient } from './CorePdasClient';
import { CoreUtilsClient } from './CoreUtilsClient';
import { ProfileClient } from './ProfileClient';
import { ConnectionClient } from './ConnectionClient';
import { SubspaceClient } from './SubspaceClient';
import { PublicationClient } from './PublicationClient';
import { ReactionClient } from './ReactionClient';
import { ReportClient } from './ReportClient';
import { AppClient } from './AppClient';
import type { Ju } from '@/Ju';

/**
 * This is a client for the Ju Core module.
 *
 * It enables us to interact with the core protocol program.
 *
 * You may access this client via the `core()` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const coreClient = ju.core();
 * ```
 *
 * @group Modules
 */
export class CoreClient {

  constructor(private ju: Ju) { }

  /**
   * You may use the `builders()` client to access the
   * underlying Transaction Builders of Core module.
   *
   * @example
   * ```ts
   * const buildersClient = ju.core().builders();
   * ```
   */
  builders() {
    return new CoreBuildersClient(this.ju);
  }

  /**
  * You may use the `pdas()` client to build PDAs related to Core module.
  *
  * @example
  * ```ts
  * const pdasClient = ju.core().pdas();
  * ```
  */
  pdas() {
    return new CorePdasClient(this.ju);
  }

  utils(app: PublicKey) {
    return new CoreUtilsClient(this.ju, app)
  }

  apps() {
    return new AppClient(this.ju)
  }

  profiles(app: PublicKey) {
    return new ProfileClient(this.ju, app)
  }

  connections(app: PublicKey) {
    return new ConnectionClient(this.ju, app)
  }

  subspaces(app: PublicKey) {
    return new SubspaceClient(this.ju, app)
  }

  publications(app: PublicKey) {
    return new PublicationClient(this.ju, app)
  }

  reactions(app: PublicKey) {
    return new ReactionClient(this.ju, app)
  }

  reports(app: PublicKey) {
    return new ReportClient(this.ju, app)
  }


  // Utils

  // uploadMetadata<T extends object = object>(
  //   input: UploadMetadataInput,
  //   options?: OperationOptions
  // ) {
  //   return this.ju
  //     .operations()
  //     .execute(uploadMetadataOperation<T>(input), options);
  // }


  // async uploadMetadata<T extends object = object>(
  //   json: T,
  //   // options?: OperationOptions
  // ) {
  //   const files = getAssetsFromJsonMetadata(json);
  //   const assetUris = await this.ju.storage().uploadAll(files);
  //   // scope.throwIfCanceled();

  //   const metadata = replaceAssetsWithUris<T>(json, assetUris);
  //   const uri = await this.ju.storage().uploadJson(metadata);

  //   return { uri, metadata, assetUris };
  // }


  // async downloadJsonMetadata<T extends AppJsonMetadata | ProfileJsonMetadata | SubspaceJsonMetadata | PublicationJsonMetadata>(
  //   uri: string, options?: OperationOptions
  // ) {
  //   try {
  //     return await this.ju.storage().downloadJson<T>(uri, options);
  //   } catch (error) {
  //     throw ('Error downloading JSON metadata');
  //   }
  // }

}