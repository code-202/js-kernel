"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const mobx_1 = require("mobx");
const lodash_1 = require("lodash");
const serializer_1 = require("@code-202/serializer");
class Container {
    services = {};
    aliases = {};
    factories = [];
    initiators = [];
    _initializeData = {};
    constructor() {
        (0, mobx_1.makeObservable)(this, {
            services: mobx_1.observable,
            aliases: mobx_1.observable,
            factories: mobx_1.observable,
            keys: mobx_1.computed,
            add: mobx_1.action,
            addFactory: mobx_1.action,
        });
    }
    add(key, service, aliases) {
        if (this.has(key)) {
            throw new Error('Service ' + key + ' is already defined');
        }
        this.services[key] = service;
        const denormalizer = new serializer_1.Denormalizer();
        if (denormalizer.isDenormalizable(service) && this._initializeData[key]) {
            service.denormalize(this._initializeData[key]);
        }
        if (typeof service.initialization === 'function') {
            service.initialization();
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
            return undefined;
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
                    throw new Error('Auto dependence : ' + factory.key + ' => ' + dependency);
                }
                if (parents.indexOf(dependency) >= 0) {
                    throw new Error('Cirular dependencies : ' + parents.join(' -> ') + ' -> ' + factory.key + ' => ' + dependency);
                }
                const d = this._get(dependency, parents.concat([factory.key]));
                if (d === undefined) {
                    throw new Error('No dependency : ' + factory.key + ' => ' + dependency + ' (undefined)');
                }
                dependencies.push(d);
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
        return (0, lodash_1.has)(this.services, key);
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
        if ((0, lodash_1.has)(this.aliases, alias)) {
            throw new Error('Alias ' + alias + ' is already defined : ' + this.getAlias(alias));
        }
        if (this.has(alias)) {
            throw new Error('Alias ' + alias + ' is already defined');
        }
        if (!(0, lodash_1.has)(this.services, key) && !this.hasFactory(key)) {
            throw new Error('Service or factory ' + key + ' is undefined');
        }
        this.aliases[alias] = key;
        return this;
    }
    getAlias(alias) {
        if ((0, lodash_1.has)(this.aliases, alias)) {
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
            throw new Error('Service ' + factory.key + ' is already defined');
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
