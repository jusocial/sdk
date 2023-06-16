"use strict";
var _a;
exports.__esModule = true;
exports.maybeThrowError = exports.resolveTransactionError = exports.errorCode = exports.amman = void 0;
var amman_client_1 = require("@metaplex-foundation/amman-client");
var mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
var log_1 = require("../../src/utils/log");
exports.amman = amman_client_1.Amman.instance({
    knownLabels: (_a = {}, _a[mpl_token_metadata_1.PROGRAM_ADDRESS] = 'Token Metadata', _a),
    log: log_1.logDebug
});
function isTransactionInstructionError(error) {
    return error.InstructionError != null;
}
function errorCode(err) {
    if (isTransactionInstructionError(err)) {
        return err.InstructionError[1].Custom;
    }
}
exports.errorCode = errorCode;
function resolveTransactionError(cusper, err) {
    var code = errorCode(err);
    if (code == null) {
        return new Error("Unknown error ".concat(err));
    }
    var cusperError = cusper.errorFromCode(code);
    if (cusperError == null) {
        return new Error("Unknown error ".concat(err, " with code ").concat(code));
    }
    return cusperError;
}
exports.resolveTransactionError = resolveTransactionError;
function maybeThrowError(cusper, err) {
    if (err == null)
        return;
    throw resolveTransactionError(cusper, err);
}
exports.maybeThrowError = maybeThrowError;
