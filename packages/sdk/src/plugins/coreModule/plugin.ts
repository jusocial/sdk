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
  findAllConnectionsByKeyListOperation,
  findAllConnectionsByKeyListOperationHandler,
  findAllConnectionsOperation,
  findAllConnectionsOperationHandler,
  findAllPublicationsByKeyListOperation,
  findAllPublicationsByKeyListOperationHandler,
  findAllPublicationsOperation,
  findAllPublicationsOperationHandler,
  findAllReactionsByKeyListOperation,
  findAllReactionsByKeyListOperationHandler,
  findAllReactionsOperation,
  findAllReactionsOperationHandler,
  findAllSubspacesByKeyListOperation,
  findAllSubspacesByKeyListOperationHandler,
  findAllSubspacesByConnectionInitializerOperation,
  findAllSubspacesByConnectionInitializerOperationHandler,
  findAllSubspacesByConnectionTargetOperation,
  findAllSubspacesByConnectionTargetOperationHandler,
  findAllSubspacesOperation,
  findAllSubspacesOperationHandler,
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
  collectPublicationOperationHandler
} from './operations';
import {
  createAppOperation,
  createAppOperationHandler,
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
  findAllProfilesByKeyListOperation,
  findAllProfilesByKeyListOperationHandler,
  findAllProfilesOperation,
  findAllProfilesOperationHandler,
  findAllProfilesByConnectionInitializerOperation,
  findAllProfilesByConnectionInitializerOperationHandler,
  findAllProfilesByConnectionTargetOperation,
  findAllProfilesByConnectionTargetOperationHandler,
} from './operations/profile';
import { CoreClient } from './clients';
import type { Ju } from '@/Ju';
import { ErrorWithLogs, JuPlugin, Program } from '@/types';

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
      findAllProfilesOperation,
      findAllProfilesOperationHandler
    );
    op.register(
      findAllProfilesByKeyListOperation,
      findAllProfilesByKeyListOperationHandler
    );
    op.register(
      findAllProfilesByConnectionInitializerOperation,
      findAllProfilesByConnectionInitializerOperationHandler
    );
    op.register(
      findAllProfilesByConnectionTargetOperation,
      findAllProfilesByConnectionTargetOperationHandler
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
      findSubspaceByAddressOperation,
      findSubspaceByAddressOperationHandler
    );
    op.register(
      findAllSubspacesOperation,
      findAllSubspacesOperationHandler
    );
    op.register(
      findAllSubspacesByConnectionInitializerOperation,
      findAllSubspacesByConnectionInitializerOperationHandler
    );
    op.register(
      findAllSubspacesByConnectionTargetOperation,
      findAllSubspacesByConnectionTargetOperationHandler
    );
    op.register(
      findAllSubspacesByKeyListOperation,
      findAllSubspacesByKeyListOperationHandler
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
      findAllConnectionsOperation,
      findAllConnectionsOperationHandler
    );
    op.register(
      findAllConnectionsByKeyListOperation,
      findAllConnectionsByKeyListOperationHandler
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
      findAllPublicationsOperation,
      findAllPublicationsOperationHandler
    );
    op.register(
      findAllPublicationsByKeyListOperation,
      findAllPublicationsByKeyListOperationHandler
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
      findAllReactionsOperation,
      findAllReactionsOperationHandler
    );
    op.register(
      findAllReactionsByKeyListOperation,
      findAllReactionsByKeyListOperationHandler
    );


    /** Reports */
    op.register(
      createReportOperation,
      createReportOperationHandler,
    );

    
    // op.register(
    //   uploadMetadataOperation,
    //   uploadMetadataOperationHandler
    // );

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