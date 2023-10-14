import {
  App,
  Profile,
  Alias,
  Connection,
  Subspace,
  Reaction,
  Publication,
  Report,
  SubspaceManager
} from '@ju-protocol/ju-core';
import {
  Account,
  getAccountParsingAndAssertingFunction,
  getAccountParsingFunction,
  // MaybeAccount,
} from '@/types';

/** @group Accounts */
export type AppAccount = Account<App>;
export type ProfileAccount = Account<Profile>;
export type AliasAccount = Account<Alias>;
export type ConnectionAccount = Account<Connection>;
export type SubspaceAccount = Account<Subspace>;
export type SubspaceManagerAccount = Account<SubspaceManager>;
export type ReactionAccount = Account<Reaction>;
export type PublicationAccount = Account<Publication>;
export type ReportAccount = Account<Report>;

/** @group Account Helpers */
export const parseAppAccount = getAccountParsingFunction(App);
export const parseProfileAccount = getAccountParsingFunction(Profile);
export const parseAliasAccount = getAccountParsingFunction(Alias);
export const parseConnectionAccount = getAccountParsingFunction(Connection);
export const parseSubspaceAccount = getAccountParsingFunction(Subspace);
export const parseSubspaceManagerAccount = getAccountParsingFunction(SubspaceManager);
export const parseReactionAccount = getAccountParsingFunction(Reaction);
export const parsePublicationAccount = getAccountParsingFunction(Publication);
export const parseReportAccount = getAccountParsingFunction(Report);

/** @group Account Helpers */
export const toAppAccount = getAccountParsingAndAssertingFunction(App);
export const toProfileAccount = getAccountParsingAndAssertingFunction(Profile);
export const toAliasAccount = getAccountParsingAndAssertingFunction(Alias);
export const toConnectionAccount = getAccountParsingAndAssertingFunction(Connection);
export const toSubspaceAccount = getAccountParsingAndAssertingFunction(Subspace);
export const toSubspaceManagerAccount = getAccountParsingAndAssertingFunction(SubspaceManager);
export const toReactionAccount = getAccountParsingAndAssertingFunction(Reaction);
export const toPublicationAccount = getAccountParsingAndAssertingFunction(Publication);
export const toReportAccount = getAccountParsingAndAssertingFunction(Report);