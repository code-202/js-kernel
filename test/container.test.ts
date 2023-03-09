import { test, expect, afterAll, beforeAll } from '@jest/globals'
import { Container } from '../src'
import { Interface, NormalizableService, ServiceA, ServiceB, ServiceC } from './services'

let container: Container.Container = new Container.Container()

test('service.a.1', () => {
    expect.assertions(8)

    const serviceA1 = new ServiceA('service.a.1')

    expect(container.keys).toEqual(expect.not.arrayContaining(['service.a.1']))

    container.add('service.a.1', serviceA1, ['alias.a.1'])

    expect(container.keys).toEqual(expect.arrayContaining(['service.a.1', 'alias.a.1']))

    expect(container.has('service.a.1')).toBe(true)
    expect(container.has('alias.a.1')).toBe(true)
    expect(container.ready('service.a.1')).toBe(true)
    expect(container.ready('alias.a.1')).toBe(true)
    expect(container.get('service.a.1')).toBe(serviceA1)
    expect(container.get('alias.a.1')).toBe(serviceA1)
})

test('service.a.2', () => {
    expect.assertions(11)

    const factoryA2 = {
        key: 'service.a.2',
        create : () => new ServiceA('service.a.2')
    }

    container.addFactory(factoryA2, ['alias.a.2', 'alias.a.2.bis'])

    expect(container.has('service.a.2')).toBe(true)
    expect(container.has('alias.a.2')).toBe(true)
    expect(container.ready('service.a.2')).toBe(false)
    expect(container.ready('alias.a.2')).toBe(false)
    expect(container.get('service.a.2')).toBeDefined()
    expect(container.get('alias.a.2')).toBeDefined()
    expect(container.get('service.a.2').get()).toBe('service.a.2')
    expect(container.get('service.a.2').get()).toBe('service.a.2')
    expect(container.ready('service.a.2')).toBe(true)
    expect(container.ready('alias.a.2')).toBe(true)
    expect(container.ready('alias.a.2.bis')).toBe(true)
})

test('service.b.3', () => {
    expect.assertions(5)

    const factoryB3 = {
        key: 'service.b.3',
        dependencies: ['service.a.1'],
        create : (s: Interface) => new ServiceB('service.b.3', s)
    }

    container.addFactory(factoryB3)

    expect(container.has('service.b.3')).toBe(true)
    expect(container.ready('service.b.3')).toBe(false)
    expect(container.get('service.b.3')).toBeDefined()
    expect(container.get('service.b.3').get()).toBe('service.b.3|service.a.1')
    expect(container.ready('service.b.3')).toBe(true)
})

test('service.c.4 & service.b.5 & service.a.6', () => {
    expect.assertions(11)

    const factoryC4 = {
        key: 'service.c.4',
        dependencies: ['service.b.5', 'alias.a.6'],
        create : (...ss: Interface[]) => new ServiceC('service.c.4', ...ss)
    }

    const factoryB5 = {
        key: 'service.b.5',
        dependencies: ['service.a.1'],
        create : (s: Interface) => new ServiceB('service.b.5', s)
    }

    const factoryA6 = {
        key: 'service.a.6',
        create : () => new ServiceA('service.a.6')
    }

    container.addFactory(factoryC4, ['alias.c.4'])
    container.addFactory(factoryB5)
    container.addFactory(factoryA6, ['alias.a.6'])

    expect(container.has('service.c.4')).toBe(true)
    expect(container.has('service.b.5')).toBe(true)
    expect(container.has('service.a.6')).toBe(true)
    expect(container.ready('service.c.4')).toBe(false)
    expect(container.ready('service.b.5')).toBe(false)
    expect(container.ready('service.a.6')).toBe(false)
    expect(container.get('alias.c.4')).toBeDefined()
    expect(container.get('alias.c.4').get()).toBe('service.c.4|service.b.5|service.a.1|service.a.6')
    expect(container.ready('service.c.4')).toBe(true)
    expect(container.ready('service.b.5')).toBe(true)
    expect(container.ready('service.a.6')).toBe(true)
})

test('keys', () => {
    expect.assertions(1)

    const keys = container.keys

    expect(keys).toEqual(expect.arrayContaining([
        'service.a.1',
        'service.a.2',
        'service.b.3',
        'service.c.4',
        'service.b.5',
        'service.a.6',
        'alias.a.1',
        'alias.a.2',
        'alias.a.2.bis',
        'alias.c.4',
        'alias.a.6',
        ]))
})

test('auto dependence', () => {
    expect.assertions(3)

    const factoryB7 = {
        key: 'service.b.7',
        dependencies: ['service.b.7'],
        create : (s: Interface) => new ServiceB('service.b.7', s)
    }

    container.addFactory(factoryB7)

    expect(() => container.get('service.b.7')).toThrow('Auto dependence : service.b.7 => service.b.7')
    expect(() => container.get('service.b.7')).toThrow(Container.ContainerError)
    expect(() => container.get('service.b.7')).toThrow(Container.AutoDependenceError)
})


test('auto dependence by alias', () => {
    expect.assertions(3)

    const factoryB8 = {
        key: 'service.b.8',
        dependencies: ['alias.b.8'],
        create : (s: Interface) => new ServiceB('service.b.8', s)
    }

    container.addFactory(factoryB8, ['alias.b.8'])

    expect(() => container.get('service.b.8')).toThrow('Auto dependence : service.b.8 => service.b.8')
    expect(() => container.get('service.b.8')).toThrow(Container.ContainerError)
    expect(() => container.get('service.b.8')).toThrow(Container.AutoDependenceError)
})

test('circular dependencies', () => {
    expect.assertions(4)

    const factoryB9 = {
        key: 'service.b.9',
        dependencies: ['alias.b.10'],
        create : (s: Interface) => new ServiceB('service.b.9', s)
    }

    const factoryB10 = {
        key: 'service.b.10',
        dependencies: ['service.b.9'],
        create : (s: Interface) => new ServiceB('service.b.10', s)
    }

    container.addFactory(factoryB9, ['alias.b.9'])
    container.addFactory(factoryB10, ['alias.b.10'])

    expect(() => container.get('alias.b.9')).toThrow('Cirular dependencies : service.b.9 -> service.b.10 => service.b.9')
    expect(() => container.get('service.b.10')).toThrow('Cirular dependencies : service.b.10 -> service.b.9 => service.b.10')
    expect(() => container.get('service.b.10')).toThrow(Container.ContainerError)
    expect(() => container.get('service.b.10')).toThrow(Container.CircularDependenciesError)
})

test('no dependency', () => {
    expect.assertions(3)

    const factoryB11 = {
        key: 'service.b.11',
        dependencies: ['unknown'],
        create : (s: Interface) => new ServiceB('service.b.11', s)
    }

    container.addFactory(factoryB11)

    expect(() => container.get('service.b.11')).toThrow('No dependency : service.b.11 => unknown (undefined)')
    expect(() => container.get('service.b.11')).toThrow(Container.ContainerError)
    expect(() => container.get('service.b.11')).toThrow(Container.NoDependencyError)
})

test('already defined', () => {
    expect.assertions(8)

    const factoryA12 = {
        key: 'service.a.12',
        create : (s: Interface) => new ServiceA('service.a.12')
    }

    container.addFactory(factoryA12)

    const factoryA13 = {
        key: 'service.a.1',
        create : (s: Interface) => new ServiceA('service.a.13')
    }

    const factoryA14 = {
        key: 'alias.a.1',
        create : (s: Interface) => new ServiceA('service.a.14')
    }

    const factoryA15 = {
        key: 'service.a.12',
        create : (s: Interface) => new ServiceA('service.a.15')
    }

    expect(() => container.add('service.a.1', new ServiceA('doublon'))).toThrow('Service service.a.1 is already defined')
    expect(() => container.add('alias.a.1', new ServiceA('doublon'))).toThrow('Service alias.a.1 is already defined')
    expect(() => container.add('service.a.12', new ServiceA('doublon'))).toThrow('Service service.a.12 is already defined')
    expect(() => container.add('service.a.12', new ServiceA('doublon'))).toThrow(Container.ContainerError)
    expect(() => container.add('service.a.12', new ServiceA('doublon'))).toThrow(Container.ServiceAlreadyDefinedError)
    expect(() => container.addFactory(factoryA13)).toThrow('Service service.a.1 is already defined')
    expect(() => container.addFactory(factoryA14)).toThrow('Service alias.a.1 is already defined')
    expect(() => container.addFactory(factoryA15)).toThrow('Service service.a.12 is already defined')
})

test('add alias', () => {
    expect.assertions(5)

    expect(() => container.addAlias('alias.a.1', 'service.a.1')).toThrow('Alias alias.a.1 is already defined : service.a.1')
    expect(() => container.addAlias('service.a.1', 'service.a.2')).toThrow('Alias service.a.1 is already defined')
    expect(() => container.addAlias('alias', 'unknown')).toThrow('Service or factory unknown is undefined')
    expect(() => container.addAlias('alias', 'unknown')).toThrow(Container.ContainerError)
    expect(() => container.addAlias('alias', 'unknown')).toThrow(Container.NoServiceError)
})

test('normalize', () => {
    expect.assertions(2)

    expect(container.normalize()).toStrictEqual({})

    container.add('service.n.1', new NormalizableService('hello', 42))
    expect(container.normalize()).toStrictEqual({
        'service.n.1': {
            foo: 'hello',
            bar: 42,
        }
    })
})

test('denormalize', () => {
    expect.assertions(2)

    container.add('service.n.2', new NormalizableService('hello', 42))
    container.denormalize({
        'service.n.2': {
            foo: 'bye',
            bar: 22,
        }
    })

    expect(container.get('service.n.2').foo).toBe('bye')
    expect(container.get('service.n.2').bar).toBe(22)
})
