import { toAliasAccount } from '../../accounts';
import { Alias, toAlias } from '../../models';
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

const Key = 'FindAliasByValueOperation' as const;

/**
 * Finds Profile or Subspace by its alias (handle).
 *
 * ```ts
 * const result = await ju
 *   .core()
 *   .findAliasByValue({ alias };
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAliasByValueOperation =
  useOperation<FindAliasByValueOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAliasByValueOperation = Operation<
  typeof Key,
  FindAliasByValueInput,
  FindAliasByValueOutput
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAliasByValueInput = {
  /** The address of the Application. */
  app: PublicKey;

  /** The alias (handle) of the Profile/Subspace. */
  alias: string;
};

export type FindAliasByValueOutput = Alias | null;

/**
 * @group Operations
 * @category Handlers
 */
export const findAliasByValueOperationHandler: OperationHandler<FindAliasByValueOperation> =
{
  handle: async (
    operation: FindAliasByValueOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    const { commitment } = scope;
    const { app, alias } = operation.input;

    const aliasPda = ju.core().pdas().alias({ app, alias });

    const aliasAccount = await ju
      .rpc()
      .getAccount(aliasPda, commitment);
    scope.throwIfCanceled();

    if (!aliasAccount.exists) {
      return null;
    }
    
    try {
      return toAlias(toAliasAccount(aliasAccount))
    } catch(error) {
      // TO-DO
      return null;
    }
  },
};