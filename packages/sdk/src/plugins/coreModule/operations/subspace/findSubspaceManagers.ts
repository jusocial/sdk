import type { PublicKey } from '@solana/web3.js';
import { SubspaceManager as SubspaceSubspaceManagerCore, subspaceManagerDiscriminator, SubspaceManagementRoleType } from '@ju-protocol/ju-core'
import { toSubspaceManagerAccount } from '../../accounts';
import { Profile } from '../../models';
import { findProfilesByKeyListOperation } from '../profile';
import {
  lamports,
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';

// -----------------
// Operation
// -----------------

const Key = 'FindSubspaceManagersOperation' as const;

/**
 * Finds Subspace Managers (as Profiles) by filters
 *
 * ```ts
 * const subspaceKeys = await ju
 *   .core()
 *   .subspaces(app)
 *   .findSubspaceManagers();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findSubspaceManagersOperation =
  useOperation<FindSubspaceManagersOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindSubspaceManagersOperation = Operation<
  typeof Key,
  FindSubspaceManagersInput,
  Profile[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindSubspaceManagersInput = {
  /** App current App address. */
  app?: PublicKey;

  /** Subspace */
  subspace?: PublicKey;

  /** Profile to add as Manager */
  profile?: PublicKey;

  /** Manager Role */
  role?: SubspaceManagementRoleType

  /**
   * Whether or not we should fetch the JSON Metadata.
   *
   * @defaultValue `true`
   */
  loadJsonMetadata?: boolean;
};

/**
 * @group Operations
 * @category Handlers
 */
export const findSubspaceManagersOperationHandler: OperationHandler<FindSubspaceManagersOperation> =
{
  handle: async (
    operation: FindSubspaceManagersOperation,
    ju: Ju,
    scope: OperationScope
  ) => {

    // const { commitment } = scope;

    const {
      app,
      subspace,
      profile,
      role,
      loadJsonMetadata = true
    } = operation.input;

    const builder = SubspaceSubspaceManagerCore.gpaBuilder();

    // Add discriminator
    builder.addFilter("accountDiscriminator", subspaceManagerDiscriminator);

    // Add additional filters
    if (app) {
      builder.addFilter("app", app)
    }
    if (subspace) {
      builder.addFilter("subspace", subspace)
    }
    if (profile) {
      builder.addFilter("profile", profile)
    }
    if (role) {
      builder.addFilter("role", role)
    }

    const res = await builder.run(ju.connection);
    scope.throwIfCanceled();

    const unparsedAccounts = res.map(({ pubkey, account }) => (
      {
        ...account,
        publicKey: pubkey,
        lamports: lamports(account.lamports),
      }
    ));

    const profilesAsKeys: PublicKey[] = [];

    for (const account of unparsedAccounts) {
      try {
        const subspaceManagerAccount = toSubspaceManagerAccount(account);

        const { profile } = subspaceManagerAccount.data;

        profilesAsKeys.push(profile);

      } catch (error) {
        // TODO
      }
    }

    const profiles = await ju
      .operations()
      .execute(findProfilesByKeyListOperation(
        {
          keys: profilesAsKeys,
          loadJsonMetadata
        },
      ), scope);


    return profiles;
  },
};