import { ProgramClient } from './ProgramClient';
import type { Ju } from '@/Ju';
import { JuPlugin } from '@/types';

/** @group Plugins */
export const programModule = (): JuPlugin => ({
  install(ju: Ju) {
    const programClient = new ProgramClient(ju);
    ju.programs = () => programClient;
  },
});

declare module '../../Ju' {
  interface Ju {
    programs(): ProgramClient;
  }
}
