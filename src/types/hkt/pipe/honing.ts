import type {OperationSync, OperationAsync} from '../..';

interface PipeFunctionHoningURItoKind<In, Out, Async extends boolean> {
    readonly OperationHoningURI: Async extends true
        ? OperationAsync<In, Out>
        : OperationSync<In, Out>;
}

export type PipeFunctionHoningKind<
    URI extends PipeFunctionHoningURIs,
    In,
    Out,
    Async extends boolean
> = PipeFunctionHoningURItoKind<In, Out, Async>[URI];

export type PipeFunctionHoningURIs = keyof PipeFunctionHoningURItoKind<
    any,
    any,
    boolean
>;
