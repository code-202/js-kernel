export interface Interface {
    get(key: string): string;
}
export declare class Environment<K extends string> implements Interface {
    private data;
    constructor(defaults: Record<K, string>, env: Record<string, string>);
    get(key: K): string;
}
