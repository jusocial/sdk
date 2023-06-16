import { UtilsClient } from './UtilsClient';
import type { Ju } from '@/Ju';
import { JuPlugin } from '@/types';

/** @group Plugins */
export const utilsModule = (): JuPlugin => ({
  install(ju: Ju) {
    const utilsClient = new UtilsClient(ju);
    ju.utils = () => utilsClient;
  },
});

declare module '../../Ju' {
  interface Ju {
    utils(): UtilsClient;
  }
}
