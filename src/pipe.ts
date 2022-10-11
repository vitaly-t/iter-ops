import {
    $A,
    $S,
    UnknownIterable,
    AsyncIterableExt,
    IterableExt,
    Operation,
} from './types';
import {toAsync} from './helpers';
import {catchError} from './ops/catch-error';
import {optimizeIterable} from './utils';
import {isAsyncIterable, isSyncIterable} from './typeguards';

interface PipeSync {
    <T>(i: Iterable<T>): IterableExt<T>;

    <T, A>(i: Iterable<T>, p0: Operation<T, A>): IterableExt<A>;

    <T, A, B>(
        i: Iterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>
    ): IterableExt<B>;

    <T, A, B, C>(
        i: Iterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>
    ): IterableExt<C>;

    <T, A, B, C, D>(
        i: Iterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>,
        p3: Operation<C, D>
    ): IterableExt<D>;

    <T, A, B, C, D, E>(
        i: Iterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>,
        p3: Operation<C, D>,
        p4: Operation<D, E>
    ): IterableExt<E>;

    <T, A, B, C, D, E, F>(
        i: Iterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>,
        p3: Operation<C, D>,
        p4: Operation<D, E>,
        p5: Operation<E, F>
    ): IterableExt<F>;

    <T, A, B, C, D, E, F, G>(
        i: Iterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>,
        p3: Operation<C, D>,
        p4: Operation<D, E>,
        p5: Operation<E, F>,
        p6: Operation<F, G>
    ): IterableExt<G>;

    <T, A, B, C, D, E, F, G, H>(
        i: Iterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>,
        p3: Operation<C, D>,
        p4: Operation<D, E>,
        p5: Operation<E, F>,
        p6: Operation<F, G>,
        p7: Operation<G, H>
    ): IterableExt<H>;

    <T, A, B, C, D, E, F, G, H, I>(
        i: Iterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>,
        p3: Operation<C, D>,
        p4: Operation<D, E>,
        p5: Operation<E, F>,
        p6: Operation<F, G>,
        p7: Operation<G, H>,
        p8: Operation<H, I>
    ): IterableExt<I>;

    <T, A, B, C, D, E, F, G, H, I, J>(
        i: Iterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>,
        p3: Operation<C, D>,
        p4: Operation<D, E>,
        p5: Operation<E, F>,
        p6: Operation<F, G>,
        p7: Operation<G, H>,
        p8: Operation<H, I>,
        p9: Operation<I, J>
    ): IterableExt<J>;

    (
        i: Iterable<unknown>,
        ...p: readonly Operation<unknown, unknown>[]
    ): IterableExt<unknown>;
}

interface PipeAsync {
    <T>(i: UnknownIterable<T>): AsyncIterableExt<T>;

    <T, A>(i: UnknownIterable<T>, p0: Operation<T, A>): AsyncIterableExt<A>;

    <T, A, B>(
        i: UnknownIterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>
    ): AsyncIterableExt<B>;

    <T, A, B, C>(
        i: UnknownIterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>
    ): AsyncIterableExt<C>;

    <T, A, B, C, D>(
        i: UnknownIterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>,
        p3: Operation<C, D>
    ): AsyncIterableExt<D>;

    <T, A, B, C, D, E>(
        i: UnknownIterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>,
        p3: Operation<C, D>,
        p4: Operation<D, E>
    ): AsyncIterableExt<E>;

    <T, A, B, C, D, E, F>(
        i: UnknownIterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>,
        p3: Operation<C, D>,
        p4: Operation<D, E>,
        p5: Operation<E, F>
    ): AsyncIterableExt<F>;

    <T, A, B, C, D, E, F, G>(
        i: UnknownIterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>,
        p3: Operation<C, D>,
        p4: Operation<D, E>,
        p5: Operation<E, F>,
        p6: Operation<F, G>
    ): AsyncIterableExt<G>;

    <T, A, B, C, D, E, F, G, H>(
        i: UnknownIterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>,
        p3: Operation<C, D>,
        p4: Operation<D, E>,
        p5: Operation<E, F>,
        p6: Operation<F, G>,
        p7: Operation<G, H>
    ): AsyncIterableExt<H>;

    <T, A, B, C, D, E, F, G, H, I>(
        i: UnknownIterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>,
        p3: Operation<C, D>,
        p4: Operation<D, E>,
        p5: Operation<E, F>,
        p6: Operation<F, G>,
        p7: Operation<G, H>,
        p8: Operation<H, I>
    ): AsyncIterableExt<I>;

    <T, A, B, C, D, E, F, G, H, I, J>(
        i: UnknownIterable<T>,
        p0: Operation<T, A>,
        p1: Operation<A, B>,
        p2: Operation<B, C>,
        p3: Operation<C, D>,
        p4: Operation<D, E>,
        p5: Operation<E, F>,
        p6: Operation<F, G>,
        p7: Operation<G, H>,
        p8: Operation<H, I>,
        p9: Operation<I, J>
    ): AsyncIterableExt<J>;

    (
        i: UnknownIterable<unknown>,
        ...p: readonly Operation<unknown, unknown>[]
    ): AsyncIterableExt<unknown>;
}

type Pipe = PipeSync & PipeAsync;

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
        | [
              UnknownIterable<unknown>,
              ...(readonly Operation<unknown, unknown>[])
          ]
        | [AsyncIterable<unknown>, ...(readonly Operation<unknown, unknown>[])]
) => {
    if (isSyncIterable(i)) {
        return pipeSync(i, ...(p as readonly Operation<unknown, unknown>[]));
    }
    if (isAsyncIterable(i)) {
        return pipeAsync(i, ...(p as readonly Operation<unknown, unknown>[]));
    }
    throw new TypeError(
        `An iterable object was expected: ${JSON.stringify(i)}`
    );
}) as Pipe;

/**
 * Pipes a synchronous `UnknownIterable` through the list of synchronous operators, and returns {@link IterableExt}.
 *
 * @see {@link toIterable}, {@link toAsync}
 * @category Core
 */
export const pipeSync = ((
    i: UnknownIterable<unknown>,
    ...p: readonly Operation<unknown, unknown>[]
) =>
    extendIterable(
        p.reduce((c, a: any) => a(c), optimizeIterable(i))
    )) as PipeSync;

/**
 * Pipes an `UnknownIterable` or `AsyncIterable` through the list of asynchronous operators, and returns {@link AsyncIterableExt}.
 *
 * @see {@link toIterable}, {@link toAsync}
 * @category Core
 */
export const pipeAsync = ((
    i: UnknownIterable<unknown>,
    ...p: readonly Operation<unknown, unknown>[]
) =>
    extendAsyncIterable(
        p.reduce((c, a: any) => a(c), toAsync(i))
    )) as PipeAsync;

/**
 * Extends an UnknownIterable object into IterableExt type.
 */
function extendIterable(i: any): IterableExt<any> | AsyncIterableExt<any> {
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
