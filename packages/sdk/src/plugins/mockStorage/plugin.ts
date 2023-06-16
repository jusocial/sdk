import { MockStorageDriver, MockStorageOptions } from './MockStorageDriver';
import { Ju } from '@/Ju';
import { JuPlugin } from '@/types';

export const mockStorage = (options?: MockStorageOptions): JuPlugin => ({
  install(ju: Ju) {
    ju.storage().setDriver(new MockStorageDriver(options));
  },
});
