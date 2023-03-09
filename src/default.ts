import { Container } from "./container";
import { Environment } from "./environment";
import { Kernel } from "./kernel";
import { Manifest } from "./manifest";

export const createEmptyKernel = (): Kernel => {
    return new Kernel(
        new Container(),
        new Environment<string>({}, {}),
        new Manifest({}, '')
    )
}
