import { Denormalizable, Normalizable } from '@code-202/serializer'
import has from 'lodash.has'

export type Context = 'node' | 'browser'

export interface Interface extends Normalizable<Normalized>, Denormalizable<Normalized> {
    get(key: string): string | undefined
}

export class Environment<K extends string> implements Interface {
    private data: Partial<Record<K, string>>

    constructor(defaults: Partial<Record<K, string>>, env: Record<string, string>) {
        this.data = defaults

        for (const key in env) {
            this.data[key as K] = env[key]
        }
    }

    public get(key: K): string | undefined {
        const contextKey = key + '.' + this.context

        if (has(this.data, contextKey)) {
            return this.data[contextKey as K]
        }

        if (has(this.data, key)) {
            return this.data[key]
        }
    }

    public normalize(): Normalized {
        return this.data
    }

    public denormalize(data: Normalized): this {
        for (const key in data) {
            this.data[key as K] = data[key]
        }

        return this
    }

    public get context(): Context {
        return typeof process !== 'undefined' && process.versions != null && process.versions.node != null ? 'node' : 'browser'
    }
}

export interface Normalized extends Partial<Record<string, string>> { }
