import { DerivedIdentityClient } from './DerivedIdentityClient';
import type { Ju } from '@/Ju';
import { JuPlugin } from '@/types';

/** @group Plugins */
export const derivedIdentity = (): JuPlugin => ({
  install(ju: Ju) {
    const derivedIdentityClient = new DerivedIdentityClient(ju);
    ju.derivedIdentity = () => derivedIdentityClient;
  },
});

declare module '../../Ju' {
  interface Ju {
    derivedIdentity(): DerivedIdentityClient;
  }
}
