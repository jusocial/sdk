import { MessengerDriver } from './MessengerDriver';
import { HasDriver } from '@/types';
import { DriverNotProvidedError } from '@/errors';

/**
 * @group Modules
 */
export class MessengerClient implements HasDriver<MessengerDriver> {
  private _driver: MessengerDriver | null = null;

  driver(): MessengerDriver {
    if (!this._driver) {
      throw new DriverNotProvidedError('StorageDriver');
    }

    return this._driver;
  }

  setDriver(newDriver: MessengerDriver): void {
    this._driver = newDriver;
  }
}