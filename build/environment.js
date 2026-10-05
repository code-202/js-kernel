"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
const lodash_has_1 = __importDefault(require("lodash.has"));
class Environment {
    data;
    forcedContext;
    constructor(defaults, env) {
        this.data = defaults;
        for (const key in env) {
            this.data[key] = env[key];
        }
    }
    get(key) {
        const contextKey = key + '.' + this.context;
        if ((0, lodash_has_1.default)(this.data, contextKey)) {
            return this.data[contextKey];
        }
        if ((0, lodash_has_1.default)(this.data, key)) {
            return this.data[key];
        }
    }
    normalize(context) {
        if (context?.browser) {
            this.forcedContext = 'browser';
        }
        else if (context?.node) {
            this.forcedContext = 'node';
        }
        const data = {};
        for (const key in this.data) {
            let skip = false;
            for (const c of ['node', 'browser']) {
                if (key.endsWith('.' + c)) {
                    skip = true;
                    continue;
                }
            }
            if (!skip) {
                data[key] = this.get(key);
            }
        }
        this.forcedContext = undefined;
        return data;
    }
    denormalize(data) {
        for (const key in data) {
            this.data[key] = data[key];
        }
        return this;
    }
    get context() {
        if (this.forcedContext !== undefined) {
            return this.forcedContext;
        }
        return typeof process !== 'undefined' && process.versions != null && process.versions.node != null ? 'node' : 'browser';
    }
}
exports.Environment = Environment;
//# sourceMappingURL=environment.js.map