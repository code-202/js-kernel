import { Denormalizable, Normalizable } from '@code-202/serializer';
import { NormalizerContext } from '@code-202/serializer/build/normalizer';
export type Context = 'node' | 'browser';
export interface Interface extends Normalizable<Normalized>, Denormalizable<Normalized> {
    get(key: string): string | undefined;
    readonly context: Context;
}
export declare class Environment<K extends string> implements Interface {
    private data;
    private forcedContext?;
    constructor(defaults: Partial<Record<K, string>>, env: Record<string, string>);
    get(key: K, forcedContext?: Context): string | undefined;
    normalize(context?: NormalizerContext): Normalized;
    denormalize(data: Normalized): this;
    get context(): Context;
}
export interface Normalized extends Partial<Record<string, string>> {
}
//# sourceMappingURL=environment.d.ts.map