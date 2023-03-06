"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKernel = void 0;
class Instance {
    kernel = null;
}
const instance = new Instance();
const getKernel = () => {
    if (!instance.kernel) {
        throw new Error('Kernel has not been instanced !');
    }
    return instance.kernel;
};
exports.getKernel = getKernel;
