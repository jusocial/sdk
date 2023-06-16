import { ReactionType } from '@ju-protocol/ju-core';
import {
  findAllReactionsByKeyListOperation,
  FindAllReactionsInput,
  findAllReactionsOperation,
  FindAllReactionsByKeyListInput,
  createReactionOperation,
  deleteReactionOperation,
} from '../operations';
import { Publication } from '../models';
import type { Ju } from '@/Ju';
import { OperationOptions } from '@/types';

/**
 * This client helps to interact with the Ju Aplication Reactions.
 *
 * You may access this client via the `core()` method of your `Ju` instance.
 *
 * @example
 * ```ts
 * const reactionClient = ju.core().reaction;
 * ```
 *
 * @see {@link Core} The `Core` model
 * @group Modules
 */
export class ReactionClient {

  constructor(readonly ju: Ju) { }

  /**
   * Creates new Reaction with Target Publication given.
   * @param {Publication} target - The given Publication instance
   * @param {ReactionType} reactionType - The reaction type
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<SendAndConfirmTransactionResponse>} The response of the Reaction creation.
   */
  create(
    target: Publication,
    reactionType: ReactionType,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(createReactionOperation(
        {
          app: target.app,
          target: target.address,
          reactionType
        }
      ), options);
  }

  /**
   * Delete the existing Reaction with Target Publication given.
   * @param {Publication} target - The given Publication instance
   * @param {OperationOptions} options - The optional operation options
   * @returns {Pomise<SendAndConfirmTransactionResponse>} The response of the Reaction delete.
   */
  delete(
    target: Publication,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(deleteReactionOperation(
        {
          app: target.app,
          target: target.address,
        }
      ),
        options
      );
  }

  /** {@inheritDoc findAllReactionsOperation} */
  keysByFilter(
    input: FindAllReactionsInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllReactionsOperation(input), options);
  }

  /** {@inheritDoc findAllReactionsByKeyListOperation} */
  findByKeyList(
    input: FindAllReactionsByKeyListInput,
    options?: OperationOptions
  ) {
    return this.ju
      .operations()
      .execute(findAllReactionsByKeyListOperation(input), options);
  }

}