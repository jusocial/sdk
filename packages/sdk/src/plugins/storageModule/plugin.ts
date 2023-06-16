import { StorageClient } from './StorageClient';
import type { Ju } from '@/Ju';
import { JuPlugin } from '@/types';

/** @group Plugins */
export const storageModule = (): JuPlugin => ({
  install(ju: Ju) {
    const storageClient = new StorageClient();
    ju.storage = () => storageClient;
  },
});

declare module '../../Ju' {
  interface Ju {
    storage(): StorageClient;
  }
}
