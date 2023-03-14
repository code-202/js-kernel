"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceAlreadyDefinedError = exports.NoServiceError = exports.NoDependencyError = exports.CircularDependenciesError = exports.AutoDependenceError = exports.AliasAlreadyDefinedError = exports.ContainerError = exports.Container = void 0;
const lodash_has_1 = __importDefault(require("lodash.has"));
const serializer_1 = require("@code-202/serializer");
const kernel_1 = require("./kernel");
class Container {
    services = {};
    aliases = {};
    factories = [];
    initiators = [];
    _initializeData = {};
    add(key, service, aliases) {
        if (this.has(key)) {
            throw new ServiceAlreadyDefinedError('Service ' + key + ' is already defined');
        }
        this.services[key] = service;
        const denormalizer = new serializer_1.Denormalizer();
        if (denormalizer.isDenormalizable(service) && this._initializeData[key]) {
            service.denormalize(this._initializeData[key]);
        }
        if (aliases) {
            for (const alias of aliases) {
                this.addAlias(alias, key);
            }
        }
        return this;
    }
    has(key) {
        return this.keys.indexOf(key) >= 0;
    }
    get(key) {
        return this._get(key, []);
    }
    _get(key, parents) {
        const alias = this.getAlias(key);
        if (alias) {
            key = alias;
        }
        if (this.ready(key)) {
            return this.services[key];
        }
        const factory = this.getFactory(key);
        if (factory === undefined) {
            throw new NoServiceError('Service does not exist and there is no factory to create it : ' + key);
        }
        const dependencies = [];
        if (factory.dependencies) {
            for (const dependencyKey of factory.dependencies) {
                let dependency = dependencyKey;
                const aliasDependency = this.getAlias(dependency);
                if (aliasDependency) {
                    dependency = aliasDependency;
                }
                if (dependency === factory.key) {
                    throw new AutoDependenceError('Auto dependence : ' + factory.key + ' => ' + dependency);
                }
                if (parents.indexOf(dependency) >= 0) {
                    throw new CircularDependenciesError('Cirular dependencies : ' + parents.join(' -> ') + ' -> ' + factory.key + ' => ' + dependency);
                }
                try {
                    const d = this._get(dependency, parents.concat([factory.key]));
                    dependencies.push(d);
                }
                catch (error) {
                    if (error instanceof NoServiceError) {
                        throw new NoDependencyError('No dependency : ' + factory.key + ' => ' + dependency + ' (undefined)');
                    }
                    throw error;
                }
            }
        }
        const service = factory.create(...dependencies);
        const factoryIndex = this.factories.indexOf(factory);
        if (factoryIndex >= 0) {
            this.factories.splice(factoryIndex, 1);
        }
        this.add(factory.key, service);
        return service;
    }
    ready(key) {
        const alias = this.getAlias(key);
        if (alias) {
            key = alias;
        }
        return (0, lodash_has_1.default)(this.services, key);
    }
    get keys() {
        const keys = Object.keys(this.services);
        for (const factory of this.factories) {
            if (keys.indexOf(factory.key) < 0) {
                keys.push(factory.key);
            }
        }
        for (const alias in this.aliases) {
            if (keys.indexOf(alias) < 0) {
                keys.push(alias);
            }
        }
        return keys;
    }
    addAlias(alias, key) {
        if ((0, lodash_has_1.default)(this.aliases, alias)) {
            throw new AliasAlreadyDefinedError('Alias ' + alias + ' is already defined : ' + this.getAlias(alias));
        }
        if (this.has(alias)) {
            throw new AliasAlreadyDefinedError('Alias ' + alias + ' is already defined');
        }
        if (!(0, lodash_has_1.default)(this.services, key) && !this.hasFactory(key)) {
            throw new NoServiceError('Service or factory ' + key + ' is undefined');
        }
        this.aliases[alias] = key;
        return this;
    }
    getAlias(alias) {
        if ((0, lodash_has_1.default)(this.aliases, alias)) {
            return this.aliases[alias];
        }
    }
    addFactories(factories) {
        for (const factory of factories) {
            this.addFactory(factory);
        }
        return this;
    }
    addFactory(factory, aliases) {
        if (this.has(factory.key)) {
            throw new ServiceAlreadyDefinedError('Service ' + factory.key + ' is already defined');
        }
        this.factories.push(factory);
        if (aliases) {
            for (const alias of aliases) {
                this.addAlias(alias, factory.key);
            }
        }
        return this;
    }
    hasFactory(key) {
        for (const factory of this.factories) {
            if (factory.key === key) {
                return true;
            }
        }
        return false;
    }
    getFactory(key) {
        for (const factory of this.factories) {
            if (factory.key === key) {
                return factory;
            }
        }
    }
    onInit(callback) {
        this.initiators.push(callback);
        return this;
    }
    init() {
        for (const initiator of this.initiators) {
            initiator();
        }
        return this;
    }
    normalize() {
        const s = {};
        const normalizer = new serializer_1.Normalizer();
        for (const key in this.services) {
            const service = this.services[key];
            if (normalizer.isNormalizable(service)) {
                s[key] = service.normalize();
            }
        }
        return s;
    }
    denormalize(data) {
        this._initializeData = data;
        const denormalizer = new serializer_1.Denormalizer();
        for (const key in this.services) {
            const service = this.services[key];
            if (denormalizer.isDenormalizable(service) && data[key]) {
                service.denormalize(data[key]);
            }
        }
        return this;
    }
}
exports.Container = Container;
class ContainerError extends kernel_1.KernelError {
}
exports.ContainerError = ContainerError;
class AliasAlreadyDefinedError extends ContainerError {
}
exports.AliasAlreadyDefinedError = AliasAlreadyDefinedError;
class AutoDependenceError extends ContainerError {
}
exports.AutoDependenceError = AutoDependenceError;
class CircularDependenciesError extends ContainerError {
}
exports.CircularDependenciesError = CircularDependenciesError;
class NoDependencyError extends ContainerError {
}
exports.NoDependencyError = NoDependencyError;
class NoServiceError extends ContainerError {
}
exports.NoServiceError = NoServiceError;
class ServiceAlreadyDefinedError extends ContainerError {
}
exports.ServiceAlreadyDefinedError = ServiceAlreadyDefinedError;
