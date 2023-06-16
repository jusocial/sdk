/* eslint-disable no-console */
import debug from 'debug';

export const logErrorDebug = debug('ju-sdk:error');
export const logInfoDebug = debug('ju-sdk:info');
export const logDebug = debug('ju-sdk:debug');
export const logTrace = debug('ju-sdk:trace');

export const logError = logErrorDebug.enabled
  ? logErrorDebug
  : console.error.bind(console);
export const logInfo = logInfoDebug.enabled
  ? logInfoDebug
  : console.log.bind(console);
