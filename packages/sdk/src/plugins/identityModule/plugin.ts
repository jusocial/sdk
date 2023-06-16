import { IdentityClient } from './IdentityClient';
import type { Ju } from '@/Ju';
import { JuPlugin } from '@/types';

/** @group Plugins */
export const identityModule = (): JuPlugin => ({
  install(ju: Ju) {
    const identityClient = new IdentityClient();
    ju.identity = () => identityClient;
  },
});

declare module '../../Ju' {
  interface Ju {
    identity(): IdentityClient;
  }
}
