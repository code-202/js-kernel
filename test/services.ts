import { Denormalizable, Normalizable } from "@code-202/serializer"
import { forOwn } from "lodash"

export interface Interface {
    get(): string
}

export class ServiceA implements Interface {
    private str: string
    constructor(str: string) {
        this.str = str
    }

    public get (): string {
        return this.str
    }
}

export class ServiceB  implements Interface {
    private str: string
    private dependency: Interface

    constructor(str: string, dependency: Interface) {
        this.str = str
        this.dependency = dependency
    }

    public get (): string {
        return this.str + '|' +this.dependency.get()
    }
}

export class ServiceC  implements Interface {
    private str: string
    private dependencies: Interface[]

    constructor(str: string, ...dependencies: Interface[]) {
        this.str = str
        this.dependencies = dependencies
    }

    public get (): string {
        let s = this.str
        for (const dependency of this.dependencies) {
            s += '|' + dependency.get()
        }
        return s
    }
}

export class NormalizableService implements Interface, Normalizable<NormalizableServiceNormalized>, Denormalizable<NormalizableServiceNormalized> {
    public foo: string
    public bar: number
    constructor (foo: string, bar: number) {
        this.foo = foo
        this.bar = bar
    }

    public normalize (): NormalizableServiceNormalized {
        return {
            foo: this.foo,
            bar: this.bar,
        }
    }

    public denormalize(data: NormalizableServiceNormalized) {
        this.foo = data.foo
        this.bar = data.bar
    }

    public get (): string {
        return this.foo + this.bar
    }
}

export interface NormalizableServiceNormalized {
    foo: string
    bar: number
}
