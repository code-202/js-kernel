import { Normalizable, Denormalizable } from '@code-202/serializer';
import { KernelError } from './kernel';
export interface Factory {
    readonly key: string;
    readonly dependencies?: string[];
    create(...dependencies: any[]): any;
}
export type Initiator = () => void;
export interface Interface extends Normalizable<Normalized>, Denormalizable<Normalized> {
    add(key: string, service: any, aliases?: string[]): this;
    has(key: string): boolean;
    get(key: string): any;
    ready(key: string): boolean;
    readonly keys: string[];
    addAlias(alias: string, key: string): this;
    getAlias(alias: string): string | undefined;
    addFactories(factories: Factory[]): this;
    addFactory(factory: Factory, aliases?: string[]): this;
    hasFactory(key: string): boolean;
    getFactory(key: string): Factory | undefined;
    onInit(callback: Initiator): this;
    init(): this;
}
export declare class Container implements Interface {
    services: Record<string, any>;
    aliases: Record<string, string>;
    factories: Factory[];
    private initiators;
    private _initializeData;
    constructor();
    add(key: string, service: any, aliases?: string[]): this;
    has(key: string): boolean;
    get(key: string): any;
    protected _get(key: string, parents: string[]): any;
    ready(key: string): boolean;
    get keys(): string[];
    addAlias(alias: string, key: string): this;
    getAlias(alias: string): string | undefined;
    addFactories(factories: Factory[]): this;
    addFactory(factory: Factory, aliases?: string[]): this;
    hasFactory(key: string): boolean;
    getFactory(key: string): Factory | undefined;
    onInit(callback: Initiator): this;
    init(): this;
    normalize(): Normalized;
    denormalize(data: Normalized): this;
}
export interface Normalized extends Record<string, any> {
}
export declare class ContainerError extends KernelError {
}
export declare class AliasAlreadyDefinedError extends ContainerError {
}
export declare class AutoDependenceError extends ContainerError {
}
export declare class CircularDependenciesError extends ContainerError {
}
export declare class NoDependencyError extends ContainerError {
}
export declare class NoServiceError extends ContainerError {
}
export declare class ServiceAlreadyDefinedError extends ContainerError {
}
