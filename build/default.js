"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyKernel = void 0;
const container_1 = require("./container");
const environment_1 = require("./environment");
const kernel_1 = require("./kernel");
const manifest_1 = require("./manifest");
const createEmptyKernel = () => {
    return new kernel_1.Kernel(new container_1.Container(), new environment_1.Environment({}, {}), new manifest_1.Manifest({}, ''));
};
exports.createEmptyKernel = createEmptyKernel;
