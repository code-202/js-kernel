import { Denormalizable, Normalizable } from '@code-202/serializer';
import * as Container from './container';
import * as Environment from './environment';
import * as Manifest from './manifest';
export declare class Kernel implements Normalizable<Normalized>, Denormalizable<Normalized> {
    private _container;
    private _environment;
    private _manifest;
    constructor(container: Container.Interface, environment: Environment.Interface, manifest: Manifest.Interface);
    get container(): Container.Interface;
    get environment(): Environment.Interface;
    get manifest(): Manifest.Interface;
    normalize(): Normalized;
    denormalize(data: Normalized): void;
}
export interface Normalized {
    container: Container.Normalized;
    environment: Environment.Normalized;
    manifest: Manifest.Normalized;
}
export declare class KernelError extends Error {
}
