export type Item = string | number | boolean | object;
export interface Interface {
    get(key: string): Item;
}
export declare class Basic<T extends Record<string, Item>> implements Interface {
    private data;
    constructor(defaults: T, env: Record<string, string>);
    get(key: string): Item;
    private loadEnv;
}
