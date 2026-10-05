import { Denormalizable, Normalizable } from '@code-202/serializer'
import { NormalizerContext } from '@code-202/serializer/build/normalizer'
import has from 'lodash.has'

export type Context = 'node' | 'browser'

export interface Interface extends Normalizable<Normalized>, Denormalizable<Normalized> {
    get(key: string): string | undefined
    readonly context: Context
}

export class Environment<K extends string> implements Interface {
    private data: Partial<Record<K, string>>

    private forcedContext?: Context

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

    public normalize(context?: NormalizerContext): Normalized {
        if (context?.browser) {
            this.forcedContext = 'browser'
        } else if (context?.node) {
            this.forcedContext = 'node'
        }

        const data: Partial<Record<K, string>> = {}

        for (const key in this.data) {
            let skip = false
            for (const c of ['node', 'browser']) {
                if (key.endsWith('.' + c)) {
                    skip = true
                    continue
                }
            }

            if (!skip) {
                data[key] = this.get(key)
            }
        }

        this.forcedContext = undefined

        return data
    }

    public denormalize(data: Normalized): this {
        for (const key in data) {
            this.data[key as K] = data[key]
        }

        return this
    }

    public get context(): Context {
        if (this.forcedContext !== undefined) {
            return this.forcedContext
        }

        return typeof process !== 'undefined' && process.versions != null && process.versions.node != null ? 'node' : 'browser'
    }
}

export interface Normalized extends Partial<Record<string, string>> { }
