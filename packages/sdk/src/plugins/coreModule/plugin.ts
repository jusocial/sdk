import { cusper, PROGRAM_ID } from '@ju-protocol/ju-core';
import { ProgramClient } from '../programModule';
import {
  createConnectionOperation,
  createConnectionOperationHandler,
  createPublicationOperation,
  createPublicationOperationHandler,
  createReactionOperation,
  createReactionOperationHandler,
  createReportOperation,
  createReportOperationHandler,
  createSubspaceOperation,
  createSubspaceOperationHandler,
  deleteConnectionOperation,
  deleteConnectionOperationHandler,
  deletePublicationOperation,
  deletePublicationOperationHandler,
  deleteReactionOperation,
  deleteReactionOperationHandler,
  deleteSubspaceOperation,
  deleteSubspaceOperationHandler,
  findAliasByValueOperation,
  findAliasByValueOperationHandler,
  findConnectionsByKeyListOperation,
  findConnectionsByKeyListOperationHandler,
  findConnectionsOperation,
  findConnectionsOperationHandler,
  findPublicationsByKeyListOperation,
  findPublicationsByKeyListOperationHandler,
  findPublicationsOperation,
  findPublicationsOperationHandler,
  findReactionsByKeyListOperation,
  findReactionsByKeyListOperationHandler,
  findReactionsOperation,
  findReactionsOperationHandler,
  findSubspacesByKeyListOperation,
  findSubspacesByKeyListOperationHandler,
  findSubspacesAsKeysByConnectionInitializerOperation,
  findSubspacesAsKeysByConnectionInitializerOperationHandler,
  findSubspacesAsKeysByConnectionTargetOperation,
  findSubspacesAsKeysByConnectionTargetOperationHandler,
  findSubspacesOperation,
  findSubspacesOperationHandler,
  // uploadMetadataOperation,
  // uploadMetadataOperationHandler,
  findAppByAddressOperation,
  findAppByAddressOperationHandler,
  findEntityByAliasValueOperation,
  findEntityByAliasValueOperationHandler,
  findPublicationByAddressOperation,
  findPublicationByAddressOperationHandler,
  findSubspaceByAddressOperation,
  findSubspaceByAddressOperationHandler,
  updateConnectionOperation,
  updateConnectionOperationHandler,
  updatePublicationOperation,
  updatePublicationOperationHandler,
  updateSubspaceOperation,
  updateSubspaceOperationHandler,
  collectPublicationOperation,
  collectPublicationOperationHandler,
  findSubspacesAsKeysOperation,
  findSubspacesAsKeysOperationHandler,
  findConnectionsAsKeysOperation,
  findConnectionsAsKeysOperationHandler,
  findPublicationsAsKeysOperation,
  findPublicationsAsKeysOperationHandler,
  findReactionsAsKeysOperation,
  findReactionsAsKeysOperationHandler,
  findReportsOperation,
  findReportsOperationHandler,
  findReportsAsKeysOperation,
  findReportsAsKeysOperationHandler,
  findReportsByKeyListOperation,
  findReportsByKeyListOperationHandler
} from './operations';
import {
  createAppOperation,
  createAppOperationHandler,
  findAppsOperation,
  findAppsOperationHandler,
  updateAppOperation,
  updateAppOperationHandler
} from './operations/app';
import {
  createProfileOperation,
  createProfileOperationHandler,
  updateProfileOperation,
  updateProfileOperationHandler,
  deleteProfileOperation,
  deleteProfileOperationHandler,
  findProfileByAddressOperation,
  findProfileByAddressOperationHandler,
  findProfilesByKeyListOperation,
  findProfilesByKeyListOperationHandler,
  findProfilesOperation,
  findProfilesOperationHandler,
  findProfilesAsKeysByConnectionInitializerOperation,
  findProfilesAsKeysByConnectionInitializerOperationHandler,
  findProfilesAsKeysByConnectionTargetOperation,
  findProfilesAsKeysByConnectionTargetOperationHandler,
  findProfilesAsKeysOperation,
  findProfilesAsKeysOperationHandler,
} from './operations/profile';
import { findAppsByKeyListOperation, findAppsByKeyListOperationHandler } from './operations/app/findAppsByKeyList';
import { findAppsAsKeysOperation, findAppsAsKeysOperationHandler } from './operations/app/findAppsAsKeys';
import { CoreClient } from './clients';
import type { Ju } from '@/Ju';
import { ErrorWithLogs, JuPlugin, Program } from '@/types';
import { addSubspaceManagerOperation, addSubspaceManagerOperationHandler } from './operations/subspace/addSubspaceManager';
import { updateSubspaceManagerOperation, updateSubspaceManagerOperationHandler } from './operations/subspace/updateSubspaceManager';
import { deleteSubspaceManagerOperation, deleteSubspaceManagerOperationHandler } from './operations/subspace/deleteSubspaceManager';
import { findSubspaceManagersOperation, findSubspaceManagersOperationHandler } from './operations/subspace/findSubspaceManagers';

/** @group Plugins */
export const coreModule = (): JuPlugin => ({
  install(ju: Ju) {

    // Ju core Program.
    const coreProgram = {
      name: 'coreProgram',
      address: PROGRAM_ID,
      errorResolver: (error: ErrorWithLogs) =>
        cusper.errorFromProgramLogs(error.logs, false),
    };
    ju.programs().register(coreProgram);
    ju.programs().getJuCore = function (
      this: ProgramClient,
      programs?: Program[]
    ) {
      return this.get(coreProgram.name, programs);
    };

    const op = ju.operations();
    op.register(
      createAppOperation,
      createAppOperationHandler,
    );
    op.register(
      updateAppOperation,
      updateAppOperationHandler,
    );
    op.register(
      findAppByAddressOperation,
      findAppByAddressOperationHandler,
    );
    op.register(
      findAppsOperation,
      findAppsOperationHandler,
    );
    op.register(
      findAppsAsKeysOperation,
      findAppsAsKeysOperationHandler,
    );
    op.register(
      findAppsByKeyListOperation,
      findAppsByKeyListOperationHandler,
    );


    /** Profiles */
    op.register(
      createProfileOperation,
      createProfileOperationHandler,
    );
    op.register(
      updateProfileOperation,
      updateProfileOperationHandler,
    );
    op.register(
      deleteProfileOperation,
      deleteProfileOperationHandler,
    );
    op.register(
      findProfileByAddressOperation,
      findProfileByAddressOperationHandler
    );
    op.register(
      findProfilesOperation,
      findProfilesOperationHandler
    );
    op.register(
      findProfilesAsKeysOperation,
      findProfilesAsKeysOperationHandler
    );
    op.register(
      findProfilesByKeyListOperation,
      findProfilesByKeyListOperationHandler
    );
    op.register(
      findProfilesAsKeysByConnectionInitializerOperation,
      findProfilesAsKeysByConnectionInitializerOperationHandler
    );
    op.register(
      findProfilesAsKeysByConnectionTargetOperation,
      findProfilesAsKeysByConnectionTargetOperationHandler
    );

    /** Subspaces */
    op.register(
      createSubspaceOperation,
      createSubspaceOperationHandler,
    );
    op.register(
      updateSubspaceOperation,
      updateSubspaceOperationHandler,
    );
    op.register(
      deleteSubspaceOperation,
      deleteSubspaceOperationHandler,
    );
    op.register(
      addSubspaceManagerOperation,
      addSubspaceManagerOperationHandler
    );
    op.register(
      updateSubspaceManagerOperation,
      updateSubspaceManagerOperationHandler
    );
    op.register(
      deleteSubspaceManagerOperation,
      deleteSubspaceManagerOperationHandler
    );
    op.register(
      findSubspaceManagersOperation,
      findSubspaceManagersOperationHandler
    );
    op.register(
      findSubspaceByAddressOperation,
      findSubspaceByAddressOperationHandler
    );
    op.register(
      findSubspacesOperation,
      findSubspacesOperationHandler
    );
    op.register(
      findSubspacesAsKeysOperation,
      findSubspacesAsKeysOperationHandler
    );
    op.register(
      findSubspacesAsKeysByConnectionInitializerOperation,
      findSubspacesAsKeysByConnectionInitializerOperationHandler
    );
    op.register(
      findSubspacesAsKeysByConnectionTargetOperation,
      findSubspacesAsKeysByConnectionTargetOperationHandler
    );
    op.register(
      findSubspacesByKeyListOperation,
      findSubspacesByKeyListOperationHandler
    );

    /** Connections */
    op.register(
      createConnectionOperation,
      createConnectionOperationHandler,
    );
    op.register(
      updateConnectionOperation,
      updateConnectionOperationHandler,
    );
    op.register(
      deleteConnectionOperation,
      deleteConnectionOperationHandler,
    );
    // op.register(
    //   findConnectionByAddressOperation,
    //   findConnectionByAddressOperationHandler
    // );
    op.register(
      findConnectionsOperation,
      findConnectionsOperationHandler
    );
    op.register(
      findConnectionsAsKeysOperation,
      findConnectionsAsKeysOperationHandler
    );
    op.register(
      findConnectionsByKeyListOperation,
      findConnectionsByKeyListOperationHandler
    );

    // Aliases
    op.register(
      findAliasByValueOperation,
      findAliasByValueOperationHandler
    );
    op.register(
      findEntityByAliasValueOperation,
      findEntityByAliasValueOperationHandler
    );

    /** Publications */
    op.register(
      createPublicationOperation,
      createPublicationOperationHandler,
    );
    op.register(
      updatePublicationOperation,
      updatePublicationOperationHandler,
    );
    op.register(
      deletePublicationOperation,
      deletePublicationOperationHandler,
    );
    op.register(
      collectPublicationOperation,
      collectPublicationOperationHandler,
    );
    op.register(
      findPublicationByAddressOperation,
      findPublicationByAddressOperationHandler
    );
    op.register(
      findPublicationsOperation,
      findPublicationsOperationHandler
    );
    op.register(
      findPublicationsAsKeysOperation,
      findPublicationsAsKeysOperationHandler
    );
    op.register(
      findPublicationsByKeyListOperation,
      findPublicationsByKeyListOperationHandler
    );


    /** Reactions */
    op.register(
      createReactionOperation,
      createReactionOperationHandler,
    );
    op.register(
      deleteReactionOperation,
      deleteReactionOperationHandler,
    );
    op.register(
      findReactionsOperation,
      findReactionsOperationHandler
    );
    op.register(
      findReactionsAsKeysOperation,
      findReactionsAsKeysOperationHandler
    );
    op.register(
      findReactionsByKeyListOperation,
      findReactionsByKeyListOperationHandler
    );


    /** Reports */
    op.register(
      createReportOperation,
      createReportOperationHandler,
    );
    op.register(
      findReportsOperation,
      findReportsOperationHandler
    );
    op.register(
      findReportsAsKeysOperation,
      findReportsAsKeysOperationHandler
    );
    op.register(
      findReportsByKeyListOperation,
      findReportsByKeyListOperationHandler
    );


    ju.core = function () {
      return new CoreClient(this);
    };
  },
});

declare module '../../Ju' {
  interface Ju {
    core(): CoreClient;
  }
}

declare module '../programModule/ProgramClient' {
  interface ProgramClient {
    getJuCore(programs?: Program[]): Program;
  }
}