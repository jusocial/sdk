"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.assertThrowsFn = exports.assertThrows = exports.spokSameAmount = exports.spokSameBignum = exports.spokSamePubkey = void 0;
var web3_js_1 = require("@solana/web3.js");
var bn_js_1 = require("bn.js");
var types_1 = require("@/types");
function spokSamePubkey(a) {
    var keyStr = typeof a === 'string' ? a : a === null || a === void 0 ? void 0 : a.toString();
    var key = typeof a === 'string' ? new web3_js_1.PublicKey(a) : a;
    var same = function (b) {
        return b != null && !!(key === null || key === void 0 ? void 0 : key.equals(b));
    };
    same.$spec = "spokSamePubkey(".concat(keyStr, ")");
    same.$description = "".concat(keyStr, " equal");
    return same;
}
exports.spokSamePubkey = spokSamePubkey;
function spokSameBignum(a) {
    var same = function (b) {
        if (a == null)
            return b == null;
        return b != null && new bn_js_1["default"](a).eq(new bn_js_1["default"](b));
    };
    same.$spec = "spokSameBignum(".concat(a, ")");
    same.$description = "".concat(a, " equal");
    return same;
}
exports.spokSameBignum = spokSameBignum;
function spokSameAmount(a) {
    var same = function (b) {
        return !!b && (0, types_1.sameAmounts)(a, b);
    };
    same.$spec = "spokSameAmount(".concat(a, ")");
    same.$description = "".concat(a, " equal");
    return same;
}
exports.spokSameAmount = spokSameAmount;
function assertThrows(t, fnOrPromise, match) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, assertThrowsFn(t, fnOrPromise, function (error) {
                        var _a, _b;
                        var message = (_b = (_a = error === null || error === void 0 ? void 0 : error.toString()) !== null && _a !== void 0 ? _a : error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : '';
                        if (message.match(match)) {
                            t.pass("throws ".concat(match.toString()));
                        }
                        else {
                            t.fail("expected to throw ".concat(match.toString(), ", got ").concat(message));
                        }
                    }, match.toString())];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.assertThrows = assertThrows;
function assertThrowsFn(t, fnOrPromise, onError, expectedError) {
    if (expectedError === void 0) { expectedError = 'an error'; }
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!(typeof fnOrPromise === 'function')) return [3 /*break*/, 2];
                    return [4 /*yield*/, fnOrPromise()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, fnOrPromise];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    t.fail("expected to throw ".concat(expectedError));
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    onError(error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.assertThrowsFn = assertThrowsFn;
