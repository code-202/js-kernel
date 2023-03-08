import { Kernel } from './kernel'
class Instance {
    public kernel: Kernel | null = null
}

const instance = new Instance()

export const getKernel = (): Kernel => {
    if (!instance.kernel) {
        throw new Error('Kernel has not been instanced !');
    }

    return instance.kernel
}

export const setKernel = (kernel: Kernel): void => {
    if (instance.kernel) {
        throw new Error('Kernel has already been instanced !');
    }

    instance.kernel = kernel
}
