"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const mobx_1 = require("mobx");
const lodash_1 = require("lodash");
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
            addService: mobx_1.action,
            addFactory: mobx_1.action,
        });
    }
    addService(key, service, aliases = []) {
        if (!(0, lodash_1.has)(this.services, key)) {
            this.services[key] = service;
            if (typeof service.deserialize === 'function' && this._initializeData[key]) {
                service.deserialize(this._initializeData[key]);
            }
        }
        if (typeof service.initialization === 'function') {
            service.initialization();
        }
        for (const alias of aliases) {
            this.addAlias(alias, key);
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
        for (const dependency of factory.dependencies) {
            if (dependency === factory.key) {
                throw new Error('auto dependence ' + factory.key + ' => ' + dependency);
            }
            if (parents.indexOf(dependency) >= 0) {
                throw new Error('cirular dependencies ' + parents.join(' -> ') + ' -> ' + factory.key + ' => ' + dependency);
            }
            const d = this._get(dependency, parents.concat([factory.key]));
            if (d === undefined) {
                throw new Error('no dependency with key : ' + dependency);
            }
            dependencies.push(d);
        }
        const service = factory.create(...dependencies);
        this.addService(factory.key, service);
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
            throw new Error('alias ' + alias + ' is already defined : ' + this.getAlias(alias));
        }
        if (!(0, lodash_1.has)(this.services, key) && !this.hasFactory(key)) {
            throw new Error('service or factory ' + key + ' is undefined');
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
    addFactory(factory) {
        if (!this.hasFactory(factory.key)) {
            this.factories.push(factory);
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
    serialize() {
        const s = {};
        for (const key in this.services) {
            const store = this.services[key];
            if (typeof store.serialize === 'function') {
                s[key] = store.serialize();
            }
        }
        return s;
    }
    deserialize(data) {
        this._initializeData = data;
        for (const key in this.services) {
            const store = this.services[key];
            if (typeof store.deserialize === 'function' && data[key]) {
                store.deserialize(data[key]);
            }
        }
        return this;
    }
}
exports.Container = Container;
