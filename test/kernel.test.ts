import { test, expect, afterAll, beforeAll } from '@jest/globals'
import { Kernel, createEmptyKernel, Container, Environment, Manifest, KernelComponent } from '../src'
import { Interface, NormalizableService, ServiceA, ServiceB, ServiceC } from './services'

const container: Container = new Container()
container.add('service.n.1', new NormalizableService('hello', 42))
const environment: Environment<'ENDPOINT'> = new Environment<'ENDPOINT'>({}, { ENDPOINT: 'https://nowhere.com'})
const manifest: Manifest = new Manifest({'apps.js': '/public/app.js'}, '')
const kernel: Kernel = new Kernel(container, environment, manifest)

test('getters', () => {
    expect.assertions(3)

    expect(kernel.container).toBe(container)
    expect(kernel.environment).toBe(environment)
    expect(kernel.manifest).toBe(manifest)
})

test('normalize', () => {
    expect.assertions(1)

    expect(kernel.normalize()).toStrictEqual({
        container: {
            'service.n.1': {
                foo: 'hello',
                bar: 42
            }
        },
        environment: {
            ENDPOINT: 'https://nowhere.com'
        },
        manifest: {
            endpoint: '',
            data: {
                'apps.js': '/public/app.js'
            }
        }
    })
})

test('denormalize', () => {
    expect.assertions(3)

    const data: KernelComponent.Normalized = {
        container: {
            'service.n.1': {
                foo: 'bye',
            }
        },
        environment: {
            ENDPOINT: 'https://somewhere.com'
        },
        manifest: {
            endpoint: 'https://somewhere.com',
            data: {
                'app.css': '/dist/css/app.other.css',
                'foo': '/bar',
            },
        }
    }

    kernel.denormalize(data)

    expect(kernel.container.get('service.n.1').foo).toBe('bye')
    expect(kernel.environment.get('ENDPOINT')).toBe('https://somewhere.com')
    expect(kernel.manifest.get('app.css')).toBe('https://somewhere.com/dist/css/app.other.css')
})
