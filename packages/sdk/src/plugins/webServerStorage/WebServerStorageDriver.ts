// import fetch from 'node-fetch';
import { JuFile, StorageDriver } from '../storageModule';
import { Amount, BigNumber, lamports, toBigNumber } from '@/types';
// import { AssetNotFoundError } from '@/errors';

const DEFAULT_HOST = 'http://localhost';
const DEFAULT_PORT = 8080;
const DEFAULT_BASE_URL = '/upload';
const DEFAULT_COST_PER_BYTE = 1;

export type WebServerStorageOptions = {
  server?: {
    host: string,
    port: number,
    baseUrl: string
  }
  costPerByte?: BigNumber | number;
};

export class WebServerStorageDriver implements StorageDriver {
  public readonly host: string;
  public readonly port: number;
  public readonly baseUrl: string;
  public readonly costPerByte: BigNumber;

  constructor(options?: WebServerStorageOptions) {
    this.host = options?.server?.host ?? DEFAULT_HOST;
    this.port = options?.server?.port ?? DEFAULT_PORT;
    this.baseUrl = options?.server?.baseUrl ?? DEFAULT_BASE_URL;
    this.costPerByte = toBigNumber(
      options?.costPerByte != null
        ? options?.costPerByte
        : DEFAULT_COST_PER_BYTE
    );
  }

  async getUploadPrice(bytes: number): Promise<Amount> {
    return lamports(this.costPerByte.muln(bytes));
  }

  async upload(file: JuFile): Promise<string> {

    const url = `${this.host}:${this.port}${this.baseUrl}`

    try {
      const res = await fetch(url, { method: 'POST', body: file.buffer })
      const json = await res.json();

      return json.url

    } catch (error) {
      // throw error;
    }

    return '';
  }
}
