import {
    $A,
    $S,
    UnknownIterable,
    AsyncIterableExt,
    IterableExt,
    SyncOperation,
    AsyncOperation,
} from './types';
import {toAsync} from './helpers';
import {catchError} from './ops/catch-error';
import {optimizeIterable} from './utils';
import {isAsyncIterable, isSyncIterable} from './typeguards';

interface PipeSync {
    <T>(i: Iterable<T>): IterableExt<T>;

    <T, A>(i: Iterable<T>, p0: SyncOperation<T, A>): IterableExt<A>;

    <T, A, B>(
        i: Iterable<T>,
        p0: SyncOperation<T, A>,
        p1: SyncOperation<A, B>
    ): IterableExt<B>;

    <T, A, B, C>(
        i: Iterable<T>,
        p0: SyncOperation<T, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>
    ): IterableExt<C>;

    <T, A, B, C, D>(
        i: Iterable<T>,
        p0: SyncOperation<T, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>,
        p3: SyncOperation<C, D>
    ): IterableExt<D>;

    <T, A, B, C, D, E>(
        i: Iterable<T>,
        p0: SyncOperation<T, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>,
        p3: SyncOperation<C, D>,
        p4: SyncOperation<D, E>
    ): IterableExt<E>;

    <T, A, B, C, D, E, F>(
        i: Iterable<T>,
        p0: SyncOperation<T, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>,
        p3: SyncOperation<C, D>,
        p4: SyncOperation<D, E>,
        p5: SyncOperation<E, F>
    ): IterableExt<F>;

    <T, A, B, C, D, E, F, G>(
        i: Iterable<T>,
        p0: SyncOperation<T, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>,
        p3: SyncOperation<C, D>,
        p4: SyncOperation<D, E>,
        p5: SyncOperation<E, F>,
        p6: SyncOperation<F, G>
    ): IterableExt<G>;

    <T, A, B, C, D, E, F, G, H>(
        i: Iterable<T>,
        p0: SyncOperation<T, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>,
        p3: SyncOperation<C, D>,
        p4: SyncOperation<D, E>,
        p5: SyncOperation<E, F>,
        p6: SyncOperation<F, G>,
        p7: SyncOperation<G, H>
    ): IterableExt<H>;

    <T, A, B, C, D, E, F, G, H, I>(
        i: Iterable<T>,
        p0: SyncOperation<T, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>,
        p3: SyncOperation<C, D>,
        p4: SyncOperation<D, E>,
        p5: SyncOperation<E, F>,
        p6: SyncOperation<F, G>,
        p7: SyncOperation<G, H>,
        p8: SyncOperation<H, I>
    ): IterableExt<I>;

    <T, A, B, C, D, E, F, G, H, I, J>(
        i: Iterable<T>,
        p0: SyncOperation<T, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>,
        p3: SyncOperation<C, D>,
        p4: SyncOperation<D, E>,
        p5: SyncOperation<E, F>,
        p6: SyncOperation<F, G>,
        p7: SyncOperation<G, H>,
        p8: SyncOperation<H, I>,
        p9: SyncOperation<I, J>
    ): IterableExt<J>;

    (
        i: Iterable<unknown>,
        ...p: readonly SyncOperation<unknown, unknown>[]
    ): IterableExt<unknown>;
}

interface PipeAsync {
    <T>(i: UnknownIterable<T>): AsyncIterableExt<T>;

    <T, A>(
        i: UnknownIterable<T>,
        p0: AsyncOperation<T, A>
    ): AsyncIterableExt<A>;

    <T, A, B>(
        i: UnknownIterable<T>,
        p0: AsyncOperation<T, A>,
        p1: AsyncOperation<A, B>
    ): AsyncIterableExt<B>;

    <T, A, B, C>(
        i: UnknownIterable<T>,
        p0: AsyncOperation<T, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>
    ): AsyncIterableExt<C>;

    <T, A, B, C, D>(
        i: UnknownIterable<T>,
        p0: AsyncOperation<T, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>,
        p3: AsyncOperation<C, D>
    ): AsyncIterableExt<D>;

    <T, A, B, C, D, E>(
        i: UnknownIterable<T>,
        p0: AsyncOperation<T, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>,
        p3: AsyncOperation<C, D>,
        p4: AsyncOperation<D, E>
    ): AsyncIterableExt<E>;

    <T, A, B, C, D, E, F>(
        i: UnknownIterable<T>,
        p0: AsyncOperation<T, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>,
        p3: AsyncOperation<C, D>,
        p4: AsyncOperation<D, E>,
        p5: AsyncOperation<E, F>
    ): AsyncIterableExt<F>;

    <T, A, B, C, D, E, F, G>(
        i: UnknownIterable<T>,
        p0: AsyncOperation<T, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>,
        p3: AsyncOperation<C, D>,
        p4: AsyncOperation<D, E>,
        p5: AsyncOperation<E, F>,
        p6: AsyncOperation<F, G>
    ): AsyncIterableExt<G>;

    <T, A, B, C, D, E, F, G, H>(
        i: UnknownIterable<T>,
        p0: AsyncOperation<T, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>,
        p3: AsyncOperation<C, D>,
        p4: AsyncOperation<D, E>,
        p5: AsyncOperation<E, F>,
        p6: AsyncOperation<F, G>,
        p7: AsyncOperation<G, H>
    ): AsyncIterableExt<H>;

    <T, A, B, C, D, E, F, G, H, I>(
        i: UnknownIterable<T>,
        p0: AsyncOperation<T, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>,
        p3: AsyncOperation<C, D>,
        p4: AsyncOperation<D, E>,
        p5: AsyncOperation<E, F>,
        p6: AsyncOperation<F, G>,
        p7: AsyncOperation<G, H>,
        p8: AsyncOperation<H, I>
    ): AsyncIterableExt<I>;

    <T, A, B, C, D, E, F, G, H, I, J>(
        i: UnknownIterable<T>,
        p0: AsyncOperation<T, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>,
        p3: AsyncOperation<C, D>,
        p4: AsyncOperation<D, E>,
        p5: AsyncOperation<E, F>,
        p6: AsyncOperation<F, G>,
        p7: AsyncOperation<G, H>,
        p8: AsyncOperation<H, I>,
        p9: AsyncOperation<I, J>
    ): AsyncIterableExt<J>;

    (
        i: UnknownIterable<unknown>,
        ...p: readonly AsyncOperation<unknown, unknown>[]
    ): AsyncIterableExt<unknown>;
}

/**
 * Pipes an `Iterable` or `AsyncIterable` through the list of operators, and returns either {@link IterableExt} or {@link AsyncIterableExt}.
 *
 * @see
 *  - {@link toIterable}
 *  - {@link toAsync}
 * @category Core
 */
export const pipe = ((
    ...[i, ...p]:
        | [Iterable<unknown>, ...(readonly SyncOperation<unknown, unknown>[])]
        | [
              AsyncIterable<unknown>,
              ...(readonly AsyncOperation<unknown, unknown>[])
          ]
) => {
    if (isSyncIterable(i)) {
        return pipeSync(
            i,
            ...(p as readonly SyncOperation<unknown, unknown>[])
        );
    }
    if (isAsyncIterable(i)) {
        return pipeAsync(
            i,
            ...(p as readonly AsyncOperation<unknown, unknown>[])
        );
    }
    throw new TypeError(
        `An iterable object was expected: ${JSON.stringify(i)}`
    );
}) as PipeSync & PipeAsync;

/**
 * Pipes a synchronous `Iterable` through the list of synchronous operators, and returns {@link IterableExt}.
 *
 * @see {@link toIterable}, {@link toAsync}
 * @category Core
 */
export const pipeSync = ((
    i: Iterable<unknown>,
    ...p: readonly SyncOperation<unknown, unknown>[]
) => extendIterable(p.reduce((c, a) => a(c), optimizeIterable(i)))) as PipeSync;

/**
 * Pipes an `Iterable` or `AsyncIterable` through the list of asynchronous operators, and returns {@link AsyncIterableExt}.
 *
 * @see {@link toIterable}, {@link toAsync}
 * @category Core
 */
export const pipeAsync = ((
    i: UnknownIterable<unknown>,
    ...p: readonly AsyncOperation<unknown, unknown>[]
) => extendAsyncIterable(p.reduce((c, a) => a(c), toAsync(i)))) as PipeAsync;

/**
 * Extends an Iterable object into IterableExt type.
 */
function extendIterable(i: any): IterableExt<any> {
    Object.defineProperty(i, 'first', {get: () => i[$S]().next().value});
    i.catch = (cb: any) => extendIterable(catchError(cb)(i));
    return i;
}

/**
 * Extends an AsyncIterable object into AsyncIterableExt type.
 */
function extendAsyncIterable(i: any): AsyncIterableExt<any> {
    Object.defineProperty(i, 'first', {
        get: () =>
            i[$A]()
                .next()
                .then((a: any) => a.value),
    });
    i.catch = (cb: any) => extendAsyncIterable(catchError(cb)(i));
    return i;
}
