import { RequestInit } from 'node-fetch';
import { JuFile } from './JuFile';
import { Amount } from '@/types';

export type StorageDriver = {
  getUploadPrice: (bytes: number) => Promise<Amount>;
  upload: (file: JuFile) => Promise<string>;
  uploadAll?: (files: JuFile[]) => Promise<string[]>;
  download?: (
    uri: string,
    options?: StorageDownloadOptions
  ) => Promise<JuFile>;
  getUploadPriceForFiles?: (files: JuFile[]) => Promise<Amount>;
};

export type StorageDownloadOptions = Omit<RequestInit, 'signal'> & {
  signal?: AbortSignal | null;
};
