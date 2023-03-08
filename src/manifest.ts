import { Denormalizable, Normalizable } from '@code-202/serializer'
import { has } from 'lodash'

export interface Interface extends Normalizable<ManifestNormalized>, Denormalizable<ManifestNormalized> {
    get (key: string, absolute: boolean): string | undefined
}

export class Manifest implements Interface {
    private _data: Record<string, string>
    private endpoint : string = ''

    constructor (data: Record<string, string>, endpoint: string)
    {
        this._data = data
        this.endpoint = endpoint
    }

    public get (key: string, absolute: boolean = true): string | undefined
    {
        if (has(this._data, key)) {
            return (absolute ? this.endpoint : '') + this._data[key]
        }
    }

    public normalize (): ManifestNormalized {
        return  {
            data: this._data,
            endpoint: this.endpoint,
        }
    }

    public denormalize (data: ManifestNormalized): this {
        for (const key in data.data) {
            this._data[key] = data.data[key]
        }

        this.endpoint = data.endpoint

        return this
    }
}

export interface ManifestNormalized {
    data: Record<string, string>,
    endpoint: string,
}
