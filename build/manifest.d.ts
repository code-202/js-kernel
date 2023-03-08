import { Denormalizable, Normalizable } from '@code-202/serializer';
export interface Interface extends Normalizable<ManifestNormalized>, Denormalizable<ManifestNormalized> {
    get(key: string, absolute: boolean): string | undefined;
}
export declare class Manifest implements Interface {
    private _data;
    private endpoint;
    constructor(data: Record<string, string>, endpoint: string);
    get(key: string, absolute?: boolean): string | undefined;
    normalize(): ManifestNormalized;
    denormalize(data: ManifestNormalized): this;
}
export interface ManifestNormalized {
    data: Record<string, string>;
    endpoint: string;
}
