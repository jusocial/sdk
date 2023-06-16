import type { Ju } from '@/Ju';

export type JuPlugin = {
  install(ju: Ju): void;
};
