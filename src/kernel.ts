import { Denormalizable, Normalizable } from '@code-202/serializer'
import * as Container from './container'
import * as Environment from './environment'
import * as Manifest from './manifest'

export class Kernel implements Normalizable<KernelNormalized>, Denormalizable<KernelNormalized>{
    private _container: Container.Interface
    private _environment: Environment.Interface
    private _manifest: Manifest.Interface

    constructor(
        container: Container.Interface,
        environment: Environment.Interface,
        manifest: Manifest.Interface
    ) {
        this._container = container
        this._environment = environment
        this._manifest = manifest
    }

    public get container (): Container.Interface
    {
        return this._container
    }

    public get environment (): Environment.Interface
    {
        return this._environment
    }

    public get manifest (): Manifest.Interface
    {
        return this._manifest
    }

    public normalize(): KernelNormalized {
        return {
            container: this.container.normalize(),
            environment: this.environment.normalize(),
            manifest: this.manifest.normalize(),
        }
    }

    public denormalize(data: KernelNormalized) {
        this.container.denormalize(data.container)
        this.environment.denormalize(data.environment)
        this.manifest.denormalize(data.manifest)
    }
}

export interface KernelNormalized {
    container: Container.ContainerNormalized
    environment: Environment.EnvironmentNormalized
    manifest: Manifest.ManifestNormalized
}
