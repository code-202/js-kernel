import { Denormalizable, Normalizable } from '@code-202/serializer'
import { has } from 'lodash'
import { KernelError } from './kernel'

export interface Interface extends Normalizable<Normalized>, Denormalizable<Normalized> {
    get (key: string, absolute?: boolean): string
}

export class Manifest implements Interface {
    private _data: Record<string, string>
    private endpoint : string = ''

    constructor (data: Record<string, string>, endpoint: string)
    {
        this._data = data
        this.endpoint = endpoint
    }

    public get (key: string, absolute: boolean = true): string
    {
        if (has(this._data, key)) {
            return (absolute ? this.endpoint : '') + this._data[key]
        }

        throw new ManifestError(`${key} does not exists in the manifest`)
    }

    public normalize (): Normalized {
        return  {
            data: this._data,
            endpoint: this.endpoint,
        }
    }

    public denormalize (data: Normalized): this {
        for (const key in data.data) {
            this._data[key] = data.data[key]
        }

        this.endpoint = data.endpoint

        return this
    }
}

export interface Normalized {
    data: Record<string, string>,
    endpoint: string,
}

export class ManifestError extends KernelError {}