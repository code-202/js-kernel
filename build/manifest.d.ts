export interface Interface {
    get(key: string, absolute: boolean): string;
}
export declare class Manifest implements Interface {
    private _data;
    private endpoint;
    constructor(data: Record<string, string>, endpoint: string);
    get(key: string, absolute?: boolean): string;
}
