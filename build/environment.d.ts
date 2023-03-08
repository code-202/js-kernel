import { Denormalizable, Normalizable } from '@code-202/serializer';
export interface Interface extends Normalizable<EnvironmentNormalized>, Denormalizable<EnvironmentNormalized> {
    get(key: string): string | undefined;
}
export declare class Environment<K extends string> implements Interface {
    private data;
    constructor(defaults: Partial<Record<K, string>>, env: Record<string, string>);
    get(key: K): string | undefined;
    normalize(): EnvironmentNormalized;
    denormalize(data: EnvironmentNormalized): this;
}
export interface EnvironmentNormalized extends Partial<Record<string, string>> {
}
