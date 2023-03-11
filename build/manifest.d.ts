import { Denormalizable, Normalizable } from '@code-202/serializer';
import { KernelError } from './kernel';
export interface Interface extends Normalizable<Normalized>, Denormalizable<Normalized> {
    get(key: string, absolute?: boolean): string;
}
export declare class Manifest implements Interface {
    private _data;
    private endpoint;
    constructor(data: Record<string, string>, endpoint: string);
    get(key: string, absolute?: boolean): string;
    normalize(): Normalized;
    denormalize(data: Normalized): this;
}
export interface Normalized {
    data: Record<string, string>;
    endpoint: string;
}
export declare class ManifestError extends KernelError {
}
