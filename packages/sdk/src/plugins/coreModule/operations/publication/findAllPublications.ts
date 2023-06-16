import type { PublicKey } from '@solana/web3.js';
import { ContentType, Publication, publicationDiscriminator } from '@ju-protocol/ju-core'
import {
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';

// -----------------
// Operation
// -----------------

const Key = 'FindAllPublicationsOperation' as const;

/**
 * Finds all Profiles for specified Application.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .findAllPublications(
 *      {
 *        app: JP8sM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUQgT,
 *        profile: ldkfgM3QGJxEdGpZ3MJP8sM3QypwzuzZpko1ueonUQasW,
 *        isMirror: true
 *      }
 *   );
 * ```
 *
 * @group Operations
 * @category Constructors
 */
export const findAllPublicationsOperation =
  useOperation<FindAllPublicationsOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindAllPublicationsOperation = Operation<
  typeof Key,
  FindAllPublicationsInput,
  PublicKey[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindAllPublicationsInput = {
  /** The address of the Application. */
  app: PublicKey;

  /** The address of the Publication creator Profile (for additional filtering) */
  profile?: PublicKey;

  /** Subspace as Publication destination  (for additional filtering)*/
  subspace?: PublicKey;

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
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindAllPublicationsOutput = PublicKey[];

/**
 * @group Operations
 * @category Handlers
 */
export const findAllPublicationsOperationHandler: OperationHandler<FindAllPublicationsOperation> =
{
  handle: async (
    operation: FindAllPublicationsOperation,
    ju: Ju,
    scope: OperationScope
  ) => {
    // const { commitment } = scope;
    const {
      app,
      profile,
      subspace,
      isMirror,
      isReply,
      targetPublication,
      contentType,
      tag
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
    if (subspace) {
      builder.addFilter("subspace", subspace)
    }
    if (isMirror) {
      builder.addFilter("isMirror", isMirror)
    }
    if (isReply) {
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

    // Limit returned accouns data to minimum
    builder.config.dataSlice = {offset: 0, length: 0};

    const result = await builder.run(ju.connection);

    scope.throwIfCanceled();

    const publicationAddresses = result.map((item) => item.pubkey)

    return publicationAddresses;
  },
};