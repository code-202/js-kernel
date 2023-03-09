import { Denormalizable, Normalizable } from '@code-202/serializer';
export interface Interface extends Normalizable<Normalized>, Denormalizable<Normalized> {
    get(key: string, absolute: boolean): string | undefined;
}
export declare class Manifest implements Interface {
    private _data;
    private endpoint;
    constructor(data: Record<string, string>, endpoint: string);
    get(key: string, absolute?: boolean): string | undefined;
    normalize(): Normalized;
    denormalize(data: Normalized): this;
}
export interface Normalized {
    data: Record<string, string>;
    endpoint: string;
}
