"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manifest = void 0;
class Manifest {
    _data;
    endpoint = '';
    constructor(data, endpoint) {
        this._data = data;
        this.endpoint = endpoint;
    }
    get(key, absolute = true) {
        return (absolute ? this.endpoint : '') + this._data[key];
    }
}
exports.Manifest = Manifest;
