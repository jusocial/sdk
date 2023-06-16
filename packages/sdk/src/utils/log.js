"use strict";
exports.__esModule = true;
exports.logInfo = exports.logError = exports.logTrace = exports.logDebug = exports.logInfoDebug = exports.logErrorDebug = void 0;
/* eslint-disable no-console */
var debug_1 = require("debug");
exports.logErrorDebug = (0, debug_1["default"])('ju-sdk:error');
exports.logInfoDebug = (0, debug_1["default"])('ju-sdk:info');
exports.logDebug = (0, debug_1["default"])('ju-sdk:debug');
exports.logTrace = (0, debug_1["default"])('ju-sdk:trace');
exports.logError = exports.logErrorDebug.enabled
    ? exports.logErrorDebug
    : console.error.bind(console);
exports.logInfo = exports.logInfoDebug.enabled
    ? exports.logInfoDebug
    : console.log.bind(console);
