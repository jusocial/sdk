import fetch, { RequestInit } from 'node-fetch';
import cloneDeep from 'lodash.clonedeep';
import {
  getBytesFromJuFiles,
  isJuFile,
  JuFile,
  toJuFile,
  toJuFileFromJson,
} from './JuFile';
import { StorageDownloadOptions, StorageDriver } from './StorageDriver';
import { Amount, HasDriver } from '@/types';
import { DriverNotProvidedError, InvalidJsonStringError } from '@/errors';
import { walk } from '@/utils';

/**
 * @group Modules
 */
export class StorageClient implements HasDriver<StorageDriver> {
  private _driver: StorageDriver | null = null;

  driver(): StorageDriver {
    if (!this._driver) {
      throw new DriverNotProvidedError('StorageDriver');
    }

    return this._driver;
  }

  setDriver(newDriver: StorageDriver): void {
    this._driver = newDriver;
  }

  getUploadPriceForBytes(bytes: number): Promise<Amount> {
    return this.driver().getUploadPrice(bytes);
  }

  getUploadPriceForFile(file: JuFile): Promise<Amount> {
    return this.getUploadPriceForFiles([file]);
  }

  getUploadPriceForFiles(files: JuFile[]): Promise<Amount> {
    const driver = this.driver();

    return driver.getUploadPriceForFiles
      ? driver.getUploadPriceForFiles(files)
      : this.getUploadPriceForBytes(getBytesFromJuFiles(...files));
  }

  upload(file: JuFile): Promise<string> {
    return this.driver().upload(file);
  }

  uploadAll(files: JuFile[]): Promise<string[]> {
    const driver = this.driver();

    return driver.uploadAll
      ? driver.uploadAll(files)
      : Promise.all(files.map((file) => this.driver().upload(file)));
  }

  uploadJson<T extends object = object>(json: T): Promise<string> {
    return this.upload(toJuFileFromJson<T>(json));
  }

  async uploadMetadata<T extends object = object>(
    json: T,
  ) {
    const files = this.getAssetsFromJsonMetadata(json);
    const assetUris = await this.uploadAll(files);
    // scope.throwIfCanceled();

    const metadata = this.replaceAssetsWithUris<T>(json, assetUris);
    const uri = await this.uploadJson(metadata);

    return { uri, metadata, assetUris };
  }

  // Helper function to extract assets from the JSON metadata
  getAssetsFromJsonMetadata(
    input: any
  ): JuFile[] {
    const files: JuFile[] = [];

    walk(input, (next, value) => {
      if (isJuFile(value)) {
        files.push(value);
      } else {
        next(value);
      }
    });

    return files;
  };

  // Helper function to replace assets with URIs in the JSON metadata
  replaceAssetsWithUris<T extends object>(
    input: T,
    replacements: string[]
  ): T {
    const clone = cloneDeep(input);
    let index = 0;

    walk(clone, (next, value, key, parent) => {
      if (isJuFile(value)) {
        if (index < replacements.length) {
          parent[key] = replacements[index++];
        }
      } else {
        next(value);
      }
    });

    return clone as T;
  };

  async download(
    uri: string,
    options?: StorageDownloadOptions
  ): Promise<JuFile> {
    const driver = this.driver();

    if (driver.download) {
      return driver.download(uri, options);
    }

    const response = await fetch(uri, options as RequestInit);
    const buffer = await response.arrayBuffer();

    return toJuFile(buffer, uri);
  }

  async downloadJson<T extends object = object>(
    uri: string,
    options?: StorageDownloadOptions
  ): Promise<T> {
    const file = await this.download(uri, options);

    try {
      return JSON.parse(file.buffer.toString());
    } catch (error) {
      throw new InvalidJsonStringError(error as Error);
    }
  }
}