import type {OperationAsync, OperationSync} from '../..';

interface PipeFunctionURItoKind<In, Out> {
    readonly PipeOperationSyncURI: OperationSync<In, Out>;
    readonly PipeOperationAsyncURI: OperationAsync<In, Out>;
}

export type PipeFunctionKind<
    URI extends PipeFunctionURIs,
    In,
    Out
> = PipeFunctionURItoKind<In, Out>[URI];

export type PipeFunctionURIs = keyof PipeFunctionURItoKind<any, any>;
