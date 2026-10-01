import { Denormalizable, Normalizable } from '@code-202/serializer';
export type Context = 'node' | 'browser';
export interface Interface extends Normalizable<Normalized>, Denormalizable<Normalized> {
    get(key: string): string | undefined;
}
export declare class Environment<K extends string> implements Interface {
    private data;
    constructor(defaults: Partial<Record<K, string>>, env: Record<string, string>);
    get(key: K): string | undefined;
    normalize(): Normalized;
    denormalize(data: Normalized): this;
    get context(): Context;
}
export interface Normalized extends Partial<Record<string, string>> {
}
//# sourceMappingURL=environment.d.ts.map