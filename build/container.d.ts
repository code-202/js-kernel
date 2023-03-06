export interface Factory {
    readonly key: string;
    readonly dependencies: string[];
    create(...dependencies: any[]): any;
}
type Initiator = () => void;
export interface Interface {
    has(key: string): boolean;
    get(key: string): any | undefined;
    ready(key: string): boolean;
    readonly keys: string[];
    addService(key: string, service: any, aliases: string[]): this;
    addAlias(alias: string, key: string): this;
    getAlias(alias: string): string | undefined;
    addFactories(factories: Factory[]): this;
    addFactory(factory: Factory, aliases: string[]): this;
    hasFactory(key: string): boolean;
    getFactory(key: string): Factory | undefined;
    onInit(callback: Initiator): this;
    init(): this;
    serialize(): Record<string, any>;
    deserialize(data: Record<string, any>): this;
}
export declare class Container implements Interface {
    services: Record<string, any>;
    aliases: Record<string, string>;
    factories: Factory[];
    private initiators;
    private _initializeData;
    constructor();
    addService(key: string, service: any, aliases?: string[]): this;
    has(key: string): boolean;
    get(key: string): any | undefined;
    protected _get(key: string, parents: string[]): any | undefined;
    ready(key: string): boolean;
    get keys(): string[];
    addAlias(alias: string, key: string): this;
    getAlias(alias: string): string | undefined;
    addFactories(factories: Factory[]): this;
    addFactory(factory: Factory): this;
    hasFactory(key: string): boolean;
    getFactory(key: string): Factory | undefined;
    onInit(callback: Initiator): this;
    init(): this;
    serialize(): Record<string, any>;
    deserialize(data: Record<string, any>): this;
}
export {};
