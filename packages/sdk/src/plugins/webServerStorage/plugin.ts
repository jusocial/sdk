import { WebServerStorageDriver, WebServerStorageOptions } from './WebServerStorageDriver';
import { Ju } from '@/Ju';
import { JuPlugin } from '@/types';

export const webServerStorage = (options?: WebServerStorageOptions): JuPlugin => ({
  install(ju: Ju) {
    ju.storage().setDriver(new WebServerStorageDriver(options));
  },
});
