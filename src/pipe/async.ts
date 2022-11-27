import {$A, AsyncIterableExt, AsyncOperation, UnknownIterable} from '../types';
import {toAsync} from '../helpers';
import {catchError} from '../ops/catch-error';

interface Pipe {
    <T extends UnknownIterable<unknown>>(i: T): T extends UnknownIterable<
        infer E
    >
        ? AsyncIterableExt<E>
        : never;

    <T extends UnknownIterable<unknown>, A>(
        i: T,
        p0: AsyncOperation<T extends UnknownIterable<infer E> ? E : never, A>
    ): AsyncIterableExt<A>;

    <T extends UnknownIterable<unknown>, A, B>(
        i: T,
        p0: AsyncOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: AsyncOperation<A, B>
    ): AsyncIterableExt<B>;

    <T extends UnknownIterable<unknown>, A, B, C>(
        i: T,
        p0: AsyncOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>
    ): AsyncIterableExt<C>;

    <T extends UnknownIterable<unknown>, A, B, C, D>(
        i: T,
        p0: AsyncOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>,
        p3: AsyncOperation<C, D>
    ): AsyncIterableExt<D>;

    <T extends UnknownIterable<unknown>, A, B, C, D, E>(
        i: T,
        p0: AsyncOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>,
        p3: AsyncOperation<C, D>,
        p4: AsyncOperation<D, E>
    ): AsyncIterableExt<E>;

    <T extends UnknownIterable<unknown>, A, B, C, D, E, F>(
        i: T,
        p0: AsyncOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>,
        p3: AsyncOperation<C, D>,
        p4: AsyncOperation<D, E>,
        p5: AsyncOperation<E, F>
    ): AsyncIterableExt<F>;

    <T extends UnknownIterable<unknown>, A, B, C, D, E, F, G>(
        i: T,
        p0: AsyncOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>,
        p3: AsyncOperation<C, D>,
        p4: AsyncOperation<D, E>,
        p5: AsyncOperation<E, F>,
        p6: AsyncOperation<F, G>
    ): AsyncIterableExt<G>;

    <T extends UnknownIterable<unknown>, A, B, C, D, E, F, G, H>(
        i: T,
        p0: AsyncOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>,
        p3: AsyncOperation<C, D>,
        p4: AsyncOperation<D, E>,
        p5: AsyncOperation<E, F>,
        p6: AsyncOperation<F, G>,
        p7: AsyncOperation<G, H>
    ): AsyncIterableExt<H>;

    <T extends UnknownIterable<unknown>, A, B, C, D, E, F, G, H, I>(
        i: T,
        p0: AsyncOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: AsyncOperation<A, B>,
        p2: AsyncOperation<B, C>,
        p3: AsyncOperation<C, D>,
        p4: AsyncOperation<D, E>,
        p5: AsyncOperation<E, F>,
        p6: AsyncOperation<F, G>,
        p7: AsyncOperation<G, H>,
        p8: AsyncOperation<H, I>
    ): AsyncIterableExt<I>;

    <T extends UnknownIterable<unknown>, A, B, C, D, E, F, G, H, I, J>(
        i: T,
        p0: AsyncOperation<T extends UnknownIterable<infer E> ? E : never, A>,
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
 * Pipes an `Iterable` or `AsyncIterable` through the list of asynchronous operators, and returns {@link AsyncIterableExt}.
 *
 * It applies automatic conversion when a synchronous iterable is passed in.
 *
 * ```ts
 * import {pipeAsync, delay} from 'iter-ops';
 *
 * const i = pipeAsync([1, 2, 3], delay(1000));
 *
 * (async function() {
 *   for await (const a of i) {
 *       console.log(a); // 1, 2, 3 (with 1s delay)
 *   }
 * })();
 * ```
 *
 * @see
 *  - {@link pipe}
 *  - {@link pipeSync}
 *  - {@link toIterable}
 *  - {@link toAsync}
 *
 * @category Core
 */
export const pipe = ((
    i: UnknownIterable<unknown>,
    ...p: readonly AsyncOperation<unknown, unknown>[]
) => extendAsyncIterable(p.reduce((c, a: any) => a(c), toAsync(i)))) as Pipe;

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
