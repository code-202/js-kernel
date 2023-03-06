"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
class Environment {
    data;
    constructor(defaults, env) {
        this.data = defaults;
        for (const key in env) {
            this.data[key] = env[key];
        }
    }
    get(key) {
        return this.data[key];
    }
}
exports.Environment = Environment;
