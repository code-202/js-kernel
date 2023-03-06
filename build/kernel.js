"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kernel = void 0;
class Kernel {
    _container;
    _environment;
    _manifest;
    constructor(container, environment, manifest) {
        this._container = container;
        this._environment = environment;
        this._manifest = manifest;
    }
    get container() {
        return this._container;
    }
    get environment() {
        return this._environment;
    }
    get manifest() {
        return this._manifest;
    }
}
exports.Kernel = Kernel;
