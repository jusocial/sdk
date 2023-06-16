import {
  findAliasByValueOperation,
  findEntityByAliasValueOperation
} from '../operations';
// import { Profile, Publication, Subspace } from '../models';
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
 * You may access this client via the `core()` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const aliasClient = ju.core().common;
 * ```
 *
 * @see {@link Core} The `Core` model
 * @group Modules
 */
export class CommonClient {

  constructor(readonly ju: Ju) { }

  /**
   * Finds entities by given request string.
   * @param {PublicKey} app - The given App address
   * @param {string} request - The given search request string
   * @param {OperationOptions} options - The optional operation options
   * @returns {Promise<SearchResultItem>} Alias instance or null.
   */
  async search(
    app: PublicKey,
    request: string,
    options?: OperationOptions
  ): Promise<SearchResultItem[]> {

    const result: SearchResultItem[] = []

    if (isPda(request)) {
      const pk = new PublicKey(request);

      try {
        const profile = await this.ju.core().profile.get(pk, options);

        result.push(
          {
            name: profile.model,
            description: `${profile.name} ${profile.surname}`,
            address: profile.address
          }
        );

        return result;

      } catch (error) {
        // TODO
      }

      try {
        const subspace = await this.ju.core().subspace.get(pk, options);

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
        const publication = await this.ju.core().publication.get(pk, options);

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
      const aliasSearchResult = await this.findEntityByAliasValue(app, request);
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
    app: PublicKey,
    alias: string,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAliasByValueOperation(
        {
          app,
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
    app: PublicKey,
    alias: string,
    loadJsonMetadata?: boolean,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findEntityByAliasValueOperation(
        {
          app,
          alias,
          loadJsonMetadata
        }
      ),
        options
      );
  }

}