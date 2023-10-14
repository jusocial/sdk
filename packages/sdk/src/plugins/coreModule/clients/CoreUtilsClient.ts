import {
  findAliasByValueOperation,
  findEntityByAliasValueOperation
} from '../operations';
// import { Profile, Publication, Subspace } from '../models';
// import { isPda } from '../helpers';
import { isPda } from '../helpers';
import type { Ju } from '@/Ju';
import { OperationOptions, PublicKey } from '@/types';


interface SearchResultItem {
  name: string,
  description: string,
  address: PublicKey,
}

/**
 * This client helps to make common interactions with the Ju Aplication.
 *
 * You may access this client via the `core().utils(app)` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const utilsClient = ju.core().utils(app);
 * ```
 *
 * @see {@link CoreClient} The `Core` client
 * @group Modules
 */
export class CoreUtilsClient {

  constructor(readonly ju: Ju, readonly app: PublicKey) { }

  /**
   * Finds entities by given request string.
   * @param {PublicKey} app - The given App address
   * @param {string} request - The given search request string
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<SearchResultItem>} Alias instance or null.
   */
  async search(
    request: string,
    loadJsonMetadata: false,
    options?: OperationOptions
  ): Promise<SearchResultItem[]> {

    const result: SearchResultItem[] = []

    if (isPda(request)) {
      const pk = new PublicKey(request);

      try {
        const profile = await this.ju
          .core()
          .profiles(this.app)
          .getProfile(pk, loadJsonMetadata, options);

        result.push(
          {
            name: profile.model,
            description: `${profile.firstName} ${profile.lastName}`,
            address: profile.address
          }
        );

        return result;

      } catch (error) {
        // TODO
      }

      try {
        const subspace = await this.ju
        .core()
        .subspaces(this.app)
        .getSubspace(pk, loadJsonMetadata, options);

        result.push(
          {
            name: subspace.model,
            description: `${subspace.alias}`,
            address: subspace.address
          }
        );

        return result;

      } catch (error) {
        // TODO
      }

      try {
        const publication = await this.ju
        .core()
        .publications(this.app)
        .getPublication(pk, loadJsonMetadata, options);

        result.push(
          {
            name: publication.model,
            description: `${publication.uuid}`,
            address: publication.address
          }
        );

        return result;

      } catch (error) {
        // TODO
      }

    } else {

      // Search alias
      const aliasSearchResult = await this.findEntityByAliasValue(request, loadJsonMetadata, options);
      if (aliasSearchResult) {
        result.push(
          {
            name: aliasSearchResult?.model,
            description: `${aliasSearchResult?.alias}`,
            address: aliasSearchResult?.address
          }
        );

        return result;
      }

      // Search Profiles by name/surname
      // TODO
    }

    return result;
  }

  /**
   * Finds ALias instance by given alias string.
   * @param {PublicKey} app - The given App address
   * @param {string} alias - The given alias string
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<Alias | null>} Alias instance or null.
   */
  findAliasByValue(
    alias: string,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAliasByValueOperation(
        {
          app: this.app,
          alias
        }
      ),
        options
      );
  }

  /**
   * Finds Profile or Subspace instance by given alias string.
   * @param {PublicKey} app - The given App address
   * @param {string} alias - The given alias string
   * @param {loadJsonMetadata} loadJsonMetadata - The flag indicates to load JSON metadata from external URI
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<Profile | Subspaca>} Profile or Subspace instance.
   */
  findEntityByAliasValue(
    alias: string,
    loadJsonMetadata?: boolean,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findEntityByAliasValueOperation(
        {
          app: this.app,
          alias,
          loadJsonMetadata
        }
      ),
        options
      );
  }

}