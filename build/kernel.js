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
    normalize() {
        return {
            container: this.container.normalize(),
            environment: this.environment.normalize(),
            manifest: this.manifest.normalize(),
        };
    }
    denormalize(data) {
        this.container.denormalize(data.container);
        this.environment.denormalize(data.environment);
        this.manifest.denormalize(data.manifest);
    }
}
exports.Kernel = Kernel;
