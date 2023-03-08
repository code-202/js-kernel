import { Denormalizable, Normalizable } from '@code-202/serializer';
import * as Container from './container';
import * as Environment from './environment';
import * as Manifest from './manifest';
export declare class Kernel implements Normalizable<KernelNormalized>, Denormalizable<KernelNormalized> {
    private _container;
    private _environment;
    private _manifest;
    constructor(container: Container.Interface, environment: Environment.Interface, manifest: Manifest.Interface);
    get container(): Container.Interface;
    get environment(): Environment.Interface;
    get manifest(): Manifest.Interface;
    normalize(): KernelNormalized;
    denormalize(data: KernelNormalized): void;
}
export interface KernelNormalized {
    container: Container.ContainerNormalized;
    environment: Environment.EnvironmentNormalized;
    manifest: Manifest.ManifestNormalized;
}
