import { has } from 'lodash'

export interface Interface {
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
}
