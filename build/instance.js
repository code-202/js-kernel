"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setKernel = exports.getKernel = void 0;
const kernel_1 = require("./kernel");
class Instance {
    kernel = null;
}
const instance = new Instance();
const getKernel = () => {
    if (!instance.kernel) {
        throw new kernel_1.KernelError('Kernel has not been instanced !');
    }
    return instance.kernel;
};
exports.getKernel = getKernel;
const setKernel = (kernel, force = false) => {
    if (!force && instance.kernel) {
        throw new kernel_1.KernelError('Kernel has already been instanced !');
    }
    instance.kernel = kernel;
};
exports.setKernel = setKernel;
