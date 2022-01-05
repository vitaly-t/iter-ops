import type {OperationAsync, OperationSync} from '../..';
import type {PipelineHKT} from '../pipe';

export type OperationSyncPipelineHKT<
    T,
    Fns extends OperationSync<any, any>[]
> = PipelineHKT<'PipeOperationSyncURI', 'OperationHoningURI', false, T, Fns>;

export type OperationAsyncPipelineHKT<
    T,
    Fns extends OperationAsync<any, any>[]
> = PipelineHKT<'PipeOperationAsyncURI', 'OperationHoningURI', true, T, Fns>;
