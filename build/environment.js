"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
const lodash_has_1 = __importDefault(require("lodash.has"));
class Environment {
    data;
    constructor(defaults, env) {
        this.data = defaults;
        for (const key in env) {
            this.data[key] = env[key];
        }
    }
    get(key) {
        if ((0, lodash_has_1.default)(this.data, key)) {
            return this.data[key];
        }
    }
    normalize() {
        return this.data;
    }
    denormalize(data) {
        for (const key in data) {
            this.data[key] = data[key];
        }
        return this;
    }
}
exports.Environment = Environment;
