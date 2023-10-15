import { PublicKey } from '@solana/web3.js';
import { ContentType, 
  Publication as PublicationCore, 
  publicationDiscriminator 
} from '@ju-protocol/ju-core'
import { toPublicationAccount } from '../../accounts';
import { Publication, PublicationJsonMetadata, toPublication } from '../../models';
// import { PublicationGpaBuilder } from '../../gpaBuilders';
import {
  lamports,
  Operation,
  OperationHandler,
  OperationScope,
  useOperation,
} from '@/types';
import type { Ju } from '@/Ju';
import { Option } from '@/utils';
import { todayToSearchInterval } from '../../helpers';

// -----------------
// Operation
// -----------------

const Key = 'FindPublicationsOperation' as const;

/**
 * Finds all Profiles for specified Application.
 *
 * ```ts
 * const profile = await ju
 *   .core()
 *   .publications(app)
 *   .findPublications(
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
export const findPublicationsOperation =
  useOperation<FindPublicationsOperation>(Key);

/**
 * @group Operations
 * @category Types
 */
export type FindPublicationsOperation = Operation<
  typeof Key,
  FindPublicationsInput,
  Publication[]
>;

/**
 * @group Operations
 * @category Inputs
 */
export type FindPublicationsInput = {
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
  tag?: string;

  /** Is event happens in 3-day-period  (for additional filtering) */
  isIn3Days?: boolean;

  /** Is event happens today  (for additional filtering) */
  isToday?: boolean;

  /**
   * Whether or not we should fetch the JSON Metadata.
   *
   * @defaultValue `false`
   */
  loadJsonMetadata?: boolean;
};

/**
 * @group Operations
 * @category Outputs
 */
// export type FindPublicationsOutput = PublicKey[];

/**
 * @group Operations
 * @category Handlers
 */
export const findPublicationsOperationHandler: OperationHandler<FindPublicationsOperation> =
{
  handle: async (
    operation: FindPublicationsOperation,
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
      isToday,
      loadJsonMetadata = false
    } = operation.input;


    // Building GPA

    // const gpaBuilder = new PublicationGpaBuilder(
    //   ju,
    //   ju.programs().getJuCore().address
    // );

    // if (app) {
    //   gpaBuilder.selectByApp(app);
    // }
    // if (profile) {
    //   gpaBuilder.selectByProfile(profile);
    // }
    // if (subspace) {
    //   gpaBuilder.selectBySubspace(subspace);
    // }
    // if (isEncrypted !== undefined) {
    //   gpaBuilder.selectByIsEncrypted(isEncrypted);
    // }
    // if (isMirror !== undefined) {
    //   gpaBuilder.selectByIsMirror(isMirror);
    // }
    // if (isReply !== undefined) {
    //   gpaBuilder.selectByByIsReply(isReply);
    // }
    // if (targetPublication) {
    //   gpaBuilder.selectByTarget(targetPublication);
    // }
    // if (contentType) {
    //   gpaBuilder.selectByContentType(contentType);
    // }
    // if (tag) {
    //   gpaBuilder.selectByTag(tag);
    // }


    // const unparsedAccounts = await gpaBuilder.get();
    // scope.throwIfCanceled();

    const builder = PublicationCore.gpaBuilder();
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
      builder.addFilter("isEncrypted",  isEncrypted)
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

    const res = await builder.run(ju.connection);
    scope.throwIfCanceled();
    

    const unparsedAccounts = res.map(({ pubkey, account }) => (
      {
        ...account,
        publicKey: pubkey,
        lamports: lamports(account.lamports),
      }
    ));

    const publications: Publication[] = [];

    for (const account of unparsedAccounts) {
      try {

        // console.log('account data :>> ', base58.encode(account.data).toString());

        // console.log('account data :>> ', account.data);

        const profileAccount = toPublicationAccount(account);

        // TO-DO: Catching metadata here might be slow, need to find the way...
        const { metadataUri } = profileAccount.data;
        let metadataJson: Option<PublicationJsonMetadata<string>> | undefined = undefined

        if (loadJsonMetadata && metadataUri) {
          try {
            metadataJson = await ju
              .storage()
              .downloadJson<PublicationJsonMetadata>(metadataUri, scope);
          } catch (error) {
            // TODO
          }
        }

        const publication = toPublication(
          profileAccount,
          metadataJson
        );

        publications.push(publication);

      } catch (error) {
        // TODO
      }
    }

    return publications;
  },
};