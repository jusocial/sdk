import { BundlrOptions, BundlrStorageDriver } from './BundlrStorageDriver';
import { Ju } from '@/Ju';
import { JuPlugin } from '@/types';

export const bundlrStorage = (options: BundlrOptions = {}): JuPlugin => ({
  install(ju: Ju) {
    ju.storage().setDriver(new BundlrStorageDriver(ju, options));
  },
});
