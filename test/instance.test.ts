import { test, expect, afterAll, beforeAll } from '@jest/globals'
import { createEmptyKernel, getKernel, setKernel } from '../src'

test('normal', () => {
    expect.assertions(2);

    expect(() => getKernel()).toThrow('Kernel has not been instanced !')

    const kernel = createEmptyKernel()
    setKernel(kernel)

    expect(getKernel()).toBe(kernel)
})
