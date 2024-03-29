import { JuError } from './JuError';

/** @group Errors */
export class BundlrError extends JuError {
  readonly name: string = 'BundlrError';
  constructor(message: string, cause?: Error) {
    super(message, 'plugin', 'Bundlr', cause);
  }
}

/** @group Errors */
export class FailedToInitializeBundlrError extends BundlrError {
  readonly name: string = 'FailedToInitializeBundlrError';

  // @ts-ignore
  constructor(cause: Error) {
    const message =
      'Bundlr could not be initialized. ' +
      'Please check the underlying error below for more details.';
    super(message, cause);
  }
}

/** @group Errors */
export class FailedToConnectToBundlrAddressError extends BundlrError {
  readonly name: string = 'FailedToConnectToBundlrAddressError';

  // @ts-ignore
  constructor(address: string, cause: Error) {
    const message =
      `Bundlr could not connect to the provided address [${address}]. ` +
      'Please ensure the provided address is valid. Some valid addresses include: ' +
      '"https://node1.bundlr.network" for mainnet and "https://devnet.bundlr.network" for devnet';
    super(message, cause);
  }
}

/** @group Errors */
export class AssetUploadFailedError extends BundlrError {
  readonly name: string = 'AssetUploadFailedError';

  // @ts-ignore
  constructor(status: number) {
    const message =
      `The asset could not be uploaded to the Bundlr network and ` +
      `returned the following status code [${status}].`;
    super(message);
  }
}

/** @group Errors */
export class BundlrWithdrawError extends BundlrError {
  readonly name: string = 'BundlrWithdrawError';

  // @ts-ignore
  constructor(status: number) {
    const message =
      `The balance could not be withdrawn from the Bundlr network and ` +
      `returned the following status code [${status}].`;
    super(message);
  }
}
