import { test, expect, afterAll, beforeAll } from '@jest/globals'
import { createEmptyKernel, getKernel, setKernel } from '../src'

test('normal', () => {
    expect.assertions(5);

    expect(() => getKernel()).toThrow('Kernel has not been instanced !')

    const kernel = createEmptyKernel()
    setKernel(kernel)

    expect(getKernel()).toBe(kernel)

    const kernel2 = createEmptyKernel()

    expect(() => setKernel(kernel2)).toThrow('Kernel has already been instanced !')

    setKernel(kernel2, true)
    expect(getKernel()).not.toBe(kernel)
    expect(getKernel()).toBe(kernel2)
})
