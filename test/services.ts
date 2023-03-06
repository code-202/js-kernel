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