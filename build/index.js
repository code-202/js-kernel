"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setKernel = exports.Manifest = exports.ManifestComponent = exports.Kernel = exports.KernelComponent = exports.getKernel = exports.Environment = exports.EnvironmentComponent = exports.createEmptyKernel = exports.Container = exports.ContainerComponent = void 0;
const ContainerComponent = __importStar(require("./container"));
exports.ContainerComponent = ContainerComponent;
const container_1 = require("./container");
Object.defineProperty(exports, "Container", { enumerable: true, get: function () { return container_1.Container; } });
const default_1 = require("./default");
Object.defineProperty(exports, "createEmptyKernel", { enumerable: true, get: function () { return default_1.createEmptyKernel; } });
const EnvironmentComponent = __importStar(require("./environment"));
exports.EnvironmentComponent = EnvironmentComponent;
const environment_1 = require("./environment");
Object.defineProperty(exports, "Environment", { enumerable: true, get: function () { return environment_1.Environment; } });
const instance_1 = require("./instance");
Object.defineProperty(exports, "getKernel", { enumerable: true, get: function () { return instance_1.getKernel; } });
Object.defineProperty(exports, "setKernel", { enumerable: true, get: function () { return instance_1.setKernel; } });
const KernelComponent = __importStar(require("./kernel"));
exports.KernelComponent = KernelComponent;
const kernel_1 = require("./kernel");
Object.defineProperty(exports, "Kernel", { enumerable: true, get: function () { return kernel_1.Kernel; } });
const ManifestComponent = __importStar(require("./manifest"));
exports.ManifestComponent = ManifestComponent;
const manifest_1 = require("./manifest");
Object.defineProperty(exports, "Manifest", { enumerable: true, get: function () { return manifest_1.Manifest; } });
