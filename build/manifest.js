"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manifest = void 0;
const lodash_1 = require("lodash");
class Manifest {
    _data;
    endpoint = '';
    constructor(data, endpoint) {
        this._data = data;
        this.endpoint = endpoint;
    }
    get(key, absolute = true) {
        if ((0, lodash_1.has)(this._data, key)) {
            return (absolute ? this.endpoint : '') + this._data[key];
        }
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
