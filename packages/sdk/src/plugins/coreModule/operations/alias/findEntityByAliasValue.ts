import { Profile, Subspace } from '../../models';
import { findProfileByAddressOperation } from '../profile';
import { findSubspaceByAddressOperation } from '../subspace';
import { findAliasByValueOperation } from './findAliasByValue';
import {
  Operation,
  OperationHandler,
  OperationScope,
  PublicKey,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';

// -----------------
// Operation
// -----------------

const Key = 'FindEntityByAliasValueOperation' as const;

/**
 * Finds Profile or Subspace by its alias (handle).
 *
 * ```ts
 * 
 * const app = await ju.core().app(JP8sM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUQgT);
 * 
 * const searchString = 'johndoe';
 * 
 * const result = await ju
 *   .core()
 *   .findEntityByAliasValue(
 *      { 
 *        app: app.address
 *        alias: searchString 
 *      }
 *    );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findEntityByAliasValueOperation =
  useOperation<FindEntityByAliasValueOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindEntityByAliasValueOperation = Operation<
  typeof Key,
  FindEntityByAliasValueInput,
  FindEntityByAliasValueOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindEntityByAliasValueInput = {
  /** The address of the Application. */
  app: PublicKey;

  /** The alias (handle) of the Profile/Subspace. */
  alias: string;

  /**
   * Whether or not we should fetch the JSON Metadata.
   *
   * @defaultValue `true`
   */
  loadJsonMetadata?: boolean;
};

export type FindEntityByAliasValueOutput = Profile | Subspace | null;

/**
 * @group Operations
 * @category Handlers
 */
export const findEntityByAliasValueOperationHandler: OperationHandler<FindEntityByAliasValueOperation> =
{
  handle: async (
    operation: FindEntityByAliasValueOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      app,
      alias,
    } = operation.input;

    const aliasAccount = await ju
      .operations()
      .execute(findAliasByValueOperation(
        {
          app,
          alias
        }
      ),
        scope
      );
    scope.throwIfCanceled();


    if (!aliasAccount) {
      return null;
    }

    const { aliasType, owner } = aliasAccount;

    if (aliasType == 0) {
      // Retrieve Profile
      const profile = await ju
        .operations()
        .execute(findProfileByAddressOperation(
          {
            profile: owner,
            loadJsonMetadata: operation.input.loadJsonMetadata
          },
        ), scope);

      return profile;
    } else if (aliasType == 1) {
      // Retrieve Subspace
      const subspace = await ju
      .operations()
      .execute(findSubspaceByAddressOperation(
        {
          subspace: owner,
          loadJsonMetadata: operation.input.loadJsonMetadata
        },
      ),
        scope
      );

      return subspace
    }

    return null

  },
};