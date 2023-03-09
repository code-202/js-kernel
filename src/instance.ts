import { Kernel, KernelError } from './kernel'
class Instance {
    public kernel: Kernel | null = null
}

const instance = new Instance()

export const getKernel = (): Kernel => {
    if (!instance.kernel) {
        throw new KernelError('Kernel has not been instanced !');
    }

    return instance.kernel
}

export const setKernel = (kernel: Kernel, force: boolean = false): void => {
    if (!force && instance.kernel) {
        throw new KernelError('Kernel has already been instanced !');
    }

    instance.kernel = kernel
}
