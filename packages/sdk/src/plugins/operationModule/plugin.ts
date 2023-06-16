import { OperationClient } from './OperationClient';
import type { Ju } from '@/Ju';
import { JuPlugin } from '@/types';

/** @group Plugins */
export const operationModule = (): JuPlugin => ({
  install(ju: Ju) {
    const operationClient = new OperationClient(ju);
    ju.operations = () => operationClient;
  },
});

declare module '../../Ju' {
  interface Ju {
    operations(): OperationClient;
  }
}
