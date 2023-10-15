import { PublicKey } from '@solana/web3.js';
import { ContentType, Publication, publicationDiscriminator } from '@ju-protocol/ju-core'
import {
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';
import { todayToSearchInterval } from '../../helpers';

// -----------------
// Operation
// -----------------

const Key = 'FindPublicationsAsKeysOperation' as const;

/**
 * Finds all Profiles for specified Application (as Public keys Array).
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .publications(app)
 *   .findPublicationsAsKeys(
 *      {
 *        profile: ldkfgM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUQasW,
 *        isMirror: true
 *      }
 *   );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findPublicationsAsKeysOperation =
  useOperation<FindPublicationsAsKeysOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindPublicationsAsKeysOperation = Operation<
  typeof Key,
  FindPublicationsAsKeysInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindPublicationsAsKeysInput = {
  /** The address of the Application. */
  app?: PublicKey;

  /** The address of the Publication creator Profile (for additional filtering) */
  profile?: PublicKey;

  /** Subspace as Publication destination  (for additional filtering)*/
  subspace?: PublicKey | false;

  /**
  * Whether or not Publication contain encrypted content
  *
  * @defaultValue `false`
  */
  isEncrypted?: boolean;

  /** Is Publication mirroring another Publication (for additional filtering) */
  isMirror?: boolean;

  /** Is Publication replying to another Publication (for additional filtering) */
  isReply?: boolean;

  /** Target Publication address. */
  targetPublication?: PublicKey;

  /** Publication Content type (for additional filtering)
  * Article = 0,
  * Image = 1,
  * Video = 2,
  * ShortVideo = 3,
  * Audio = 4,
  * Text = 5,
  * Link = 6 
  */
  contentType?: ContentType;

  /** Publication Tag  (for additional filtering) */
  tag?: string,

  /** Is event happens in 3-day-period  (for additional filtering) */
  isIn3Days?: boolean;

  /** Is event happens today  (for additional filtering) */
  isToday?: boolean;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindPublicationsAsKeysOutput = PublicKey[];

/**
 * @group Operations
 * @category Handlers
 */
export const findPublicationsAsKeysOperationHandler: OperationHandler<FindPublicationsAsKeysOperation> =
{
  handle: async (
    operation: FindPublicationsAsKeysOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      app,
      profile,
      subspace,
      isEncrypted,
      isMirror,
      isReply,
      targetPublication,
      contentType,
      tag,
      isIn3Days,
      isToday
    } = operation.input;

    // Building GPA
    const builder = Publication.gpaBuilder();

    // Add discriminator
    builder.addFilter("accountDiscriminator", publicationDiscriminator);

    // Add additional filters

    if (app) {
      builder.addFilter("app", app)
    }
    if (profile) {
      builder.addFilter("profile", profile)
    }
    if (subspace !== undefined) {
      if (subspace === false) {
        builder.addFilter("subspace", PublicKey.default)
      } else {
        builder.addFilter("subspace", subspace);
      }
    }
    if (isEncrypted !== undefined) {
      builder.addFilter('isEncrypted', isEncrypted)
    }
    if (isMirror !== undefined) {
      builder.addFilter("isMirror", isMirror)
    }
    if (isReply !== undefined) {
      builder.addFilter("isReply", isReply)
    }
    if (targetPublication) {
      builder.addFilter("targetPublication", targetPublication)
    }
    if (contentType) {
      builder.addFilter("contentType", contentType)
    }
    if (tag) {
      builder.addFilter("tag", tag)
    }
    if (isIn3Days) {
      builder.addFilter("searchable3Day", todayToSearchInterval(3))
    }
    if (isToday) {
      builder.addFilter("searchableDay", todayToSearchInterval(1))
    }

    // Limit returned accouns data to minimum
    builder.config.dataSlice = { offset: 0, length: 0 };

    const result = await builder.run(ju.connection);

    scope.throwIfCanceled();

    const publicationAddresses = result.map((item) => item.pubkey)

    return publicationAddresses;
  },
};