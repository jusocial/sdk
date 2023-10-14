import { MessengerClient } from './MessengerClient';
import type { Ju } from '@/Ju';
import { JuPlugin } from '@/types';

/** @group Plugins */
export const messengerModule = (): JuPlugin => ({
  install(ju: Ju) {
    const messengerClient = new MessengerClient();
    ju.messenger = () => messengerClient;
  },
});

declare module '../../Ju' {
  interface Ju {
    messenger(): MessengerClient;
  }
}
