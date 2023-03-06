import { has } from 'lodash'

export interface Interface {
    get (key: string): string | undefined
}

export class Environment<K extends string> implements Interface
{
    private data: Partial<Record<K, string>>

    constructor(defaults: Partial<Record<K, string>>, env: Record<string, string>) {
        this.data = defaults

        for (const key in env) {
            this.data[key as K] = env[key]
        }
    }

    public get (key: K): string | undefined {
        if (has(this.data, key)) {
            return this.data[key]
        }
    }
}
