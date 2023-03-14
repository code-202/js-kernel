import has from 'lodash.has'
import { Normalizable, Denormalizable, Normalizer, Denormalizer } from '@code-202/serializer'
import { KernelError } from './kernel'

export interface Factory {
    readonly key: string
    readonly dependencies?: string[]
    create(...dependencies: any[]): any
}

export type Initiator = () => void

export interface Interface extends Normalizable<Normalized>, Denormalizable<Normalized> {
    add (key: string, service: any, aliases?: string[]): this
    has (key: string): boolean
    get (key: string): any
    ready (key: string): boolean
    readonly keys: string[]
    addAlias (alias: string, key: string): this
    getAlias (alias: string): string | undefined

    addFactories (factories: Factory[]): this
    addFactory (factory: Factory, aliases?: string[]): this
    hasFactory (key: string): boolean
    getFactory (key: string): Factory | undefined

    onInit (callback: Initiator): this
    init (): this
}

export class Container implements Interface
{
    public services: Record<string, any> = {}
    public aliases: Record<string, string> = {}
    public factories: Factory[] = []
    private initiators:Initiator[] = []
    private _initializeData: Record<string, any> = {}

    add (key: string, service: any, aliases?: string[]): this {
        if (this.has(key)) {
            throw new ServiceAlreadyDefinedError('Service ' + key + ' is already defined')
        }

        this.services[key] = service

        const denormalizer = new Denormalizer()
        if (denormalizer.isDenormalizable(service) && this._initializeData[key]) {
            service.denormalize(this._initializeData[key])
        }

        if (aliases) {
            for (const alias of aliases) {
                this.addAlias(alias, key)
            }
        }

        return this
    }

    has (key: string): boolean {
        return this.keys.indexOf(key) >= 0
    }

    get (key: string): any {
        return this._get(key, [])
    }

    protected _get (key: string, parents: string[]): any {

        const alias = this.getAlias(key)

        if (alias) {
            key = alias
        }

        if (this.ready(key)) {
            return this.services[key]
        }

        const factory = this.getFactory(key)
        if (factory === undefined) {
            throw new NoServiceError('Service does not exist and there is no factory to create it : ' + key)
        }

        const dependencies: any[] = []

        if (factory.dependencies) {
            for (const dependencyKey of factory.dependencies) {
                let dependency = dependencyKey

                const aliasDependency = this.getAlias(dependency)
                if (aliasDependency) {
                    dependency = aliasDependency
                }

                if (dependency === factory.key) {
                    throw new AutoDependenceError('Auto dependence : ' + factory.key + ' => ' + dependency)
                }
                if (parents.indexOf(dependency) >= 0) {
                    throw new CircularDependenciesError('Cirular dependencies : ' + parents.join(' -> ') + ' -> ' + factory.key + ' => ' + dependency)
                }

                try {
                    const d = this._get(dependency, parents.concat([factory.key]))
                    dependencies.push(d)
                } catch (error) {
                    if (error instanceof NoServiceError) {
                        throw new NoDependencyError('No dependency : ' + factory.key + ' => ' + dependency + ' (undefined)')
                    }
                    throw error
                }
            }
        }

        const service = factory.create(...dependencies)

        const factoryIndex = this.factories.indexOf(factory)
        if (factoryIndex >= 0) {
            this.factories.splice(factoryIndex, 1)
        }

        this.add(factory.key, service)

        return service
    }

    ready (key: string): boolean {
        const alias = this.getAlias(key)

        if (alias) {
            key = alias
        }

        return has(this.services, key)
    }

    get keys (): string[] {
        const keys: string[] = Object.keys(this.services)

        for (const factory of this.factories) {
            if (keys.indexOf(factory.key) < 0) {
                keys.push(factory.key)
            }
        }

        for (const alias in this.aliases) {
            if (keys.indexOf(alias) < 0) {
                keys.push(alias)
            }
        }

        return keys
    }

    addAlias (alias: string, key: string): this {
        if (has(this.aliases, alias)) {
            throw new AliasAlreadyDefinedError('Alias ' + alias + ' is already defined : ' + this.getAlias(alias))
        }

        if (this.has(alias)) {
            throw new AliasAlreadyDefinedError('Alias ' + alias + ' is already defined')
        }

        if (!has(this.services, key) && !this.hasFactory(key)) {
            throw new NoServiceError('Service or factory ' + key + ' is undefined')
        }

        this.aliases[alias] = key

        return this
    }

    getAlias (alias: string): string | undefined {
        if (has(this.aliases, alias)) {
            return this.aliases[alias]
        }
    }

    addFactories (factories: Factory[]): this {
        for (const factory of factories) {
            this.addFactory(factory)
        }

        return this
    }

    addFactory (factory: Factory, aliases?: string[]): this {
        if (this.has(factory.key)) {
            throw new ServiceAlreadyDefinedError('Service ' + factory.key + ' is already defined')
        }

        this.factories.push(factory)

        if (aliases) {
            for (const alias of aliases) {
                this.addAlias(alias, factory.key)
            }
        }

        return this
    }

    hasFactory (key: string): boolean {
        for (const factory of this.factories) {
            if (factory.key === key) {
                return true
            }
        }

        return false
    }

    getFactory (key: string): Factory | undefined {
        for (const factory of this.factories) {
            if (factory.key === key) {
                return factory
            }
        }
    }

    onInit (callback: Initiator): this {
        this.initiators.push(callback)

        return this
    }

    init (): this {
        for (const initiator of this.initiators) {
            initiator()
        }

        return this
    }

    public normalize (): Normalized {
        const s: Normalized = {}
        const normalizer = new Normalizer()
        for (const key in this.services) {
            const service = this.services[key]

            if (normalizer.isNormalizable(service)) {
                s[key] = service.normalize()
            }
        }

        return s
    }

    public denormalize (data: Normalized): this {
        this._initializeData = data
        const denormalizer = new Denormalizer()
        for (const key in this.services) {
            const service = this.services[key]

            if (denormalizer.isDenormalizable(service) && data[key]) {
                service.denormalize(data[key])
            }
        }

        return this
    }
}

export interface Normalized extends Record<string, any> {}

export class ContainerError extends KernelError {}

export class AliasAlreadyDefinedError extends ContainerError {}
export class AutoDependenceError extends ContainerError {}
export class CircularDependenciesError extends ContainerError {}
export class NoDependencyError extends ContainerError {}
export class NoServiceError extends ContainerError {}
export class ServiceAlreadyDefinedError extends ContainerError {}
