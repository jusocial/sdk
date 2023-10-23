import { ReactionType } from '@ju-protocol/ju-core';
import {
  findReactionsByKeyListOperation,
  FindReactionsInput,
  findReactionsOperation,
  FindReactionsByKeyListInput,
  createReactionOperation,
  deleteReactionOperation,
  FindReactionsAsKeysInput,
  findReactionsAsKeysOperation,
} from '../operations';
import type { Ju } from '@/Ju';
import { OperationOptions, PublicKey } from '@/types';

/**
 * This client helps to interact with the Ju Aplication Reactions.
 *
 * You may access this client via the `core().reactions(app)` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const reactionClient = ju.core().reactions(app);
 * ```
 *
 * @see {@link CoreClient} The `Core` client
 * @group Modules
 */
export class ReactionClient {

  constructor(readonly ju: Ju, readonly app: PublicKey) { }

  /**
   * Creates new Reaction with Target Publication given.
   * @param {PublicKey} target - The given Target entity PublicKey
   * @param {ReactionType} reactionType - The reaction type
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<SendAndConfirmTransactionResponse>} The response of the Reaction creation.
   */
  createReaction(
    target: PublicKey,
    reactionType: ReactionType,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(createReactionOperation(
        {
          app: this.app,
          target,
          reactionType
        }
      ), options);
  }

  /**
   * Delete the existing Reaction with Target Publication given.
   * @param {PublicKey} target - The given Target entity PublicKey
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<SendAndConfirmTransactionResponse>} The response of the Reaction delete.
   */
  deleteReaction(
    target: PublicKey,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(deleteReactionOperation(
        {
          app: this.app,
          target,
        }
      ),
        options
      );
  }

  /** {@inheritDoc findReactionsOperation} */
  findReactions(
    filter: Omit<FindReactionsInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findReactionsOperation(
        {
          app: (filter.initializer || filter.target) ? undefined : this.app,
          ...filter
        }
      ), options);
  }

  /** {@inheritDoc findReactionsOperation} */
  findReactionsAsKeys(
    filter: Omit<FindReactionsAsKeysInput, 'app'>,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findReactionsAsKeysOperation(
        {
          app: (filter.initializer || filter.target) ? undefined : this.app,
          ...filter
        }
      ), options);
  }

  /** {@inheritDoc findReactionsByKeyListOperation} */
  getReactionsByKeyList(
    input: FindReactionsByKeyListInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findReactionsByKeyListOperation(input), options);
  }

  /**
   * Checks if Reaction on Initializer and Target exist.
   * @param {PublicKey} initializer - The initializer PublicKey
   * @param {PublicKey} target - The given Target entity PublicKey
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<boolean>} Promise boolean
   */
  async isReactionsExist(
    initializer: PublicKey,
    target: PublicKey,
    options?: OperationOptions
  ) {
    const reactionPda = this.ju.core().pdas().reaction(
      {
        app: this.app,
        target,
        initializer
      }
    )

    return await this.ju.rpc().accountExists(reactionPda, options?.commitment);
  }

}