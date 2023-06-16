import { SystemProgram } from '@solana/web3.js';
import { ProgramClient } from '../programModule';
import {
  createAccountOperation,
  createAccountOperationHandler,
  transferSolOperation,
  transferSolOperationHandler,
} from './operations';
import { SystemClient } from './SystemClient';
import type { Ju } from '@/Ju';
import type { JuPlugin, Program } from '@/types';

/**
 * @group Plugins
 */
/** @group Plugins */
export const systemModule = (): JuPlugin => ({
  install(ju: Ju) {
    // Program.
    const systemProgram = {
      name: 'SystemProgram',
      address: SystemProgram.programId,
    };
    ju.programs().register(systemProgram);
    ju.programs().getSystem = function (
      this: ProgramClient,
      programs?: Program[]
    ) {
      return this.get(systemProgram.name, programs);
    };

    // Operations.
    const op = ju.operations();
    op.register(createAccountOperation, createAccountOperationHandler);
    op.register(transferSolOperation, transferSolOperationHandler);

    ju.system = function () {
      return new SystemClient(this);
    };
  },
});

declare module '../../Ju' {
  interface Ju {
    system(): SystemClient;
  }
}

declare module '../programModule/ProgramClient' {
  interface ProgramClient {
    getSystem(programs?: Program[]): Program;
  }
}
