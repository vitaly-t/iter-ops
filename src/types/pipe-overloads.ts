import type {AsyncIterableExt, IterableExt, OperationAsync, OperationSync} from '.';
import type {OperationAsyncPipelineHKT, OperationSyncPipelineHKT} from './hkt/operation';
import type {AsyncIterableOf, IterableOf} from './utils';

type PipeSyncResult<
    I extends Iterable<unknown>,
    Fns extends OperationSync<any, any>[]
> = IterableExt<
    OperationSyncPipelineHKT<IterableOf<I>, Fns> extends OperationSync<
        unknown,
        infer Out
    >
        ? Iterable<Out>
        : never
    >;

type PipeAsyncResult<
    I extends AsyncIterable<any>,
    Fns extends OperationAsync<any, any>[]
> = AsyncIterableExt<
    OperationAsyncPipelineHKT<AsyncIterableOf<I>, Fns> extends OperationAsync<
        any,
        infer Out
    >
        ? AsyncIterable<Out>
        : never
>;

export type PipeSync = {
    <T>(i: Iterable<T>): PipeSyncResult<Iterable<T>, []>
    <T, A>(i: Iterable<T>, ...p: [OperationSync<T, A>]): PipeSyncResult<Iterable<T>, typeof p>
    <T, A, B>(i: Iterable<T>, ...p: [OperationSync<T, A>, OperationSync<A, B>]): PipeSyncResult<Iterable<T>, typeof p>
    <T, A, B, C>(i: Iterable<T>, ...p: [OperationSync<T, A>, OperationSync<A, B>, OperationSync<B, C>]): PipeSyncResult<Iterable<T>, typeof p>
    <T, A, B, C, D>(i: Iterable<T>, ...p: [OperationSync<T, A>, OperationSync<A, B>, OperationSync<B, C>, OperationSync<C, D>]): PipeSyncResult<Iterable<T>, typeof p>
    <T, A, B, C, D, E>(i: Iterable<T>, ...p: [OperationSync<T, A>, OperationSync<A, B>, OperationSync<B, C>, OperationSync<C, D>, OperationSync<D, E>]): PipeSyncResult<Iterable<T>, typeof p>
    <T, A, B, C, D, E, F>(i: Iterable<T>, ...p: [OperationSync<T, A>, OperationSync<A, B>, OperationSync<B, C>, OperationSync<C, D>, OperationSync<D, E>, OperationSync<E, F>]): PipeSyncResult<Iterable<T>, typeof p>
    <T, A, B, C, D, E, F, G>(i: Iterable<T>, ...p: [OperationSync<T, A>, OperationSync<A, B>, OperationSync<B, C>, OperationSync<C, D>, OperationSync<D, E>, OperationSync<E, F>, OperationSync<F, G>]): PipeSyncResult<Iterable<T>, typeof p>
    <T, A, B, C, D, E, F, G, H>(i: Iterable<T>, ...p: [OperationSync<T, A>, OperationSync<A, B>, OperationSync<B, C>, OperationSync<C, D>, OperationSync<D, E>, OperationSync<E, F>, OperationSync<F, G>, OperationSync<G, H>]): PipeSyncResult<Iterable<T>, typeof p>
    <T, A, B, C, D, E, F, G, H, I>(i: Iterable<T>, ...p: [OperationSync<T, A>, OperationSync<A, B>, OperationSync<B, C>, OperationSync<C, D>, OperationSync<D, E>, OperationSync<E, F>, OperationSync<F, G>, OperationSync<G, H>, OperationSync<H, I>]): PipeSyncResult<Iterable<T>, typeof p>
    <T, A, B, C, D, E, F, G, H, I, J>(i: Iterable<T>, ...p: [OperationSync<T, A>, OperationSync<A, B>, OperationSync<B, C>, OperationSync<C, D>, OperationSync<D, E>, OperationSync<E, F>, OperationSync<F, G>, OperationSync<G, H>, OperationSync<H, I>, OperationSync<I, J>]): PipeSyncResult<Iterable<T>, typeof p>
    <T, A, B, C, D, E, F, G, H, I, J>(i: Iterable<T>, ...p: [OperationSync<T, A>, OperationSync<A, B>, OperationSync<B, C>, OperationSync<C, D>, OperationSync<D, E>, OperationSync<E, F>, OperationSync<F, G>, OperationSync<G, H>, OperationSync<H, I>, OperationSync<I, J>, OperationSync<J, unknown>, ...OperationSync<unknown, unknown>[]]): PipeSyncResult<Iterable<T>, typeof p>
};

export type PipeAsync = {
    <T>(i: AsyncIterable<T>): PipeAsyncResult<AsyncIterable<T>, []>
    <T, A>(i: AsyncIterable<T>, ...p: [OperationAsync<T, A>]): PipeAsyncResult<AsyncIterable<T>, typeof p>
    <T, A, B>(i: AsyncIterable<T>, ...p: [OperationAsync<T, A>, OperationAsync<A, B>]): PipeAsyncResult<AsyncIterable<T>, typeof p>
    <T, A, B, C>(i: AsyncIterable<T>, ...p: [OperationAsync<T, A>, OperationAsync<A, B>, OperationAsync<B, C>]): PipeAsyncResult<AsyncIterable<T>, typeof p>
    <T, A, B, C, D>(i: AsyncIterable<T>, ...p: [OperationAsync<T, A>, OperationAsync<A, B>, OperationAsync<B, C>, OperationAsync<C, D>]): PipeAsyncResult<AsyncIterable<T>, typeof p>
    <T, A, B, C, D, E>(i: AsyncIterable<T>, ...p: [OperationAsync<T, A>, OperationAsync<A, B>, OperationAsync<B, C>, OperationAsync<C, D>, OperationAsync<D, E>]): PipeAsyncResult<AsyncIterable<T>, typeof p>
    <T, A, B, C, D, E, F>(i: AsyncIterable<T>, ...p: [OperationAsync<T, A>, OperationAsync<A, B>, OperationAsync<B, C>, OperationAsync<C, D>, OperationAsync<D, E>, OperationAsync<E, F>]): PipeAsyncResult<AsyncIterable<T>, typeof p>
    <T, A, B, C, D, E, F, G>(i: AsyncIterable<T>, ...p: [OperationAsync<T, A>, OperationAsync<A, B>, OperationAsync<B, C>, OperationAsync<C, D>, OperationAsync<D, E>, OperationAsync<E, F>, OperationAsync<F, G>]): PipeAsyncResult<AsyncIterable<T>, typeof p>
    <T, A, B, C, D, E, F, G, H>(i: AsyncIterable<T>, ...p: [OperationAsync<T, A>, OperationAsync<A, B>, OperationAsync<B, C>, OperationAsync<C, D>, OperationAsync<D, E>, OperationAsync<E, F>, OperationAsync<F, G>, OperationAsync<G, H>]): PipeAsyncResult<AsyncIterable<T>, typeof p>
    <T, A, B, C, D, E, F, G, H, I>(i: AsyncIterable<T>, ...p: [OperationAsync<T, A>, OperationAsync<A, B>, OperationAsync<B, C>, OperationAsync<C, D>, OperationAsync<D, E>, OperationAsync<E, F>, OperationAsync<F, G>, OperationAsync<G, H>, OperationAsync<H, I>]): PipeAsyncResult<AsyncIterable<T>, typeof p>
    <T, A, B, C, D, E, F, G, H, I, J>(i: AsyncIterable<T>, ...p: [OperationAsync<T, A>, OperationAsync<A, B>, OperationAsync<B, C>, OperationAsync<C, D>, OperationAsync<D, E>, OperationAsync<E, F>, OperationAsync<F, G>, OperationAsync<G, H>, OperationAsync<H, I>, OperationAsync<I, J>]): PipeAsyncResult<AsyncIterable<T>, typeof p>
    <T, A, B, C, D, E, F, G, H, I, J>(i: AsyncIterable<T>, ...p: [OperationAsync<T, A>, OperationAsync<A, B>, OperationAsync<B, C>, OperationAsync<C, D>, OperationAsync<D, E>, OperationAsync<E, F>, OperationAsync<F, G>, OperationAsync<G, H>, OperationAsync<H, I>, OperationAsync<I, J>, OperationAsync<J, unknown>, ...OperationAsync<unknown, unknown>[]]): PipeAsyncResult<AsyncIterable<T>, typeof p>
};
