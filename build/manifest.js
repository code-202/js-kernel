"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestError = exports.Manifest = void 0;
const lodash_has_1 = __importDefault(require("lodash.has"));
const kernel_1 = require("./kernel");
class Manifest {
    _data;
    endpoint = '';
    constructor(data, endpoint) {
        this._data = data;
        this.endpoint = endpoint;
    }
    get(key, absolute = true) {
        if ((0, lodash_has_1.default)(this._data, key)) {
            return (absolute ? this.endpoint : '') + this._data[key];
        }
        throw new ManifestError(`${key} does not exists in the manifest`);
    }
    normalize() {
        return {
            data: this._data,
            endpoint: this.endpoint,
        };
    }
    denormalize(data) {
        for (const key in data.data) {
            this._data[key] = data.data[key];
        }
        this.endpoint = data.endpoint;
        return this;
    }
}
exports.Manifest = Manifest;
class ManifestError extends kernel_1.KernelError {
}
exports.ManifestError = ManifestError;
