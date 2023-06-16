import { RpcClient } from './RpcClient';
import type { Ju } from '@/Ju';
import { JuPlugin } from '@/types';

/** @group Plugins */
export const rpcModule = (): JuPlugin => ({
  install(ju: Ju) {
    const rpcClient = new RpcClient(ju);
    ju.rpc = () => rpcClient;
  },
});

declare module '../../Ju' {
  interface Ju {
    rpc(): RpcClient;
  }
}
