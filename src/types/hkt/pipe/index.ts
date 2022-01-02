import type {PipeFunctionKind, PipeFunctionURIs} from './functions';
import type {PipeFunctionHoningKind, PipeFunctionHoningURIs} from './honing';

export * from './functions';

export type PipelineHKT<
    PipeFunctionURI extends PipeFunctionURIs,
    PipeFunctionHoningURI extends PipeFunctionHoningURIs,
    Async extends boolean,
    T,
    Fns extends PipeFunctionKind<PipeFunctionURI, any, any>[]
> = Fns extends readonly [infer Head, ...any[]]
    ? Head extends PipeFunctionKind<PipeFunctionURI, T, any>
        ? PipelineHKTHelper<
              PipeFunctionURI,
              PipeFunctionHoningURI,
              Async,
              Fns,
              T,
              T
          >
        : never
    : never;

type PipelineHKTHelper<
    PipeFunctionURI extends PipeFunctionURIs,
    PipeFunctionHoningURI extends PipeFunctionHoningURIs,
    Async extends boolean,
    Fns extends PipeFunctionKind<PipeFunctionURI, any, any>[],
    FirstIn,
    PreviousOut
> = Fns extends readonly [infer Head, ...infer Rest]
    ? Head extends PipeFunctionKind<PipeFunctionURI, infer CurrentIn, infer Out>
        ? [CurrentIn] extends [PreviousOut]
            ? Rest extends PipeFunctionKind<PipeFunctionURI, any, any>[]
                ? Rest extends readonly [
                      PipeFunctionKind<PipeFunctionURI, any, any>,
                      ...PipeFunctionKind<PipeFunctionURI, any, any>[]
                  ]
                    ? PipelineHKTHelper<
                          PipeFunctionURI,
                          PipeFunctionHoningURI,
                          Async,
                          Rest,
                          FirstIn,
                          Out
                      >
                    : PipeFunctionHoningKind<
                          PipeFunctionHoningURI,
                          FirstIn,
                          Out,
                          Async
                      >
                : never
            : never // PipeLineError: trying to pass previous output to incompatible current input
        : never
    : never;
