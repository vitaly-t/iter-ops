import {$S, AsyncIterableExt, IterableExt, SyncOperation} from '../types';
import {catchError} from '../ops/catch-error';
import {optimizeIterable} from '../utils';
import {isAsyncIterable} from '../typeguards';

interface Pipe {
    <T extends Iterable<unknown>>(i: T): T extends Iterable<infer E>
        ? IterableExt<E>
        : never;

    <T extends Iterable<unknown>, A>(
        i: T,
        p0: SyncOperation<T extends Iterable<infer E> ? E : never, A>
    ): IterableExt<A>;

    <T extends Iterable<unknown>, A, B>(
        i: T,
        p0: SyncOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: SyncOperation<A, B>
    ): IterableExt<B>;

    <T extends Iterable<unknown>, A, B, C>(
        i: T,
        p0: SyncOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>
    ): IterableExt<C>;

    <T extends Iterable<unknown>, A, B, C, D>(
        i: T,
        p0: SyncOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>,
        p3: SyncOperation<C, D>
    ): IterableExt<D>;

    <T extends Iterable<unknown>, A, B, C, D, E>(
        i: T,
        p0: SyncOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>,
        p3: SyncOperation<C, D>,
        p4: SyncOperation<D, E>
    ): IterableExt<E>;

    <T extends Iterable<unknown>, A, B, C, D, E, F>(
        i: T,
        p0: SyncOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>,
        p3: SyncOperation<C, D>,
        p4: SyncOperation<D, E>,
        p5: SyncOperation<E, F>
    ): IterableExt<F>;

    <T extends Iterable<unknown>, A, B, C, D, E, F, G>(
        i: T,
        p0: SyncOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>,
        p3: SyncOperation<C, D>,
        p4: SyncOperation<D, E>,
        p5: SyncOperation<E, F>,
        p6: SyncOperation<F, G>
    ): IterableExt<G>;

    <T extends Iterable<unknown>, A, B, C, D, E, F, G, H>(
        i: T,
        p0: SyncOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>,
        p3: SyncOperation<C, D>,
        p4: SyncOperation<D, E>,
        p5: SyncOperation<E, F>,
        p6: SyncOperation<F, G>,
        p7: SyncOperation<G, H>
    ): IterableExt<H>;

    <T extends Iterable<unknown>, A, B, C, D, E, F, G, H, I>(
        i: T,
        p0: SyncOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: SyncOperation<A, B>,
        p2: SyncOperation<B, C>,
        p3: SyncOperation<C, D>,
        p4: SyncOperation<D, E>,
        p5: SyncOperation<E, F>,
        p6: SyncOperation<F, G>,
        p7: SyncOperation<G, H>,
        p8: SyncOperation<H, I>
    ): IterableExt<I>;

    <T extends Iterable<unknown>, A, B, C, D, E, F, G, H, I, J>(
        i: T,
        p0: SyncOperation<T extends Iterable<infer E> ? E : never, A>,
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

/**
 * Pipes a synchronous `Iterable` through the list of synchronous operators, and returns {@link IterableExt}.
 *
 * @see
 *  - {@link pipe}
 *  - {@link pipeAsync}
 *  - {@link toIterable}
 *  - {@link toAsync}
 *
 * @throws `TypeError: 'Cannot run the sync pipeline from an AsyncIterable'` when the iterable is asynchronous.
 *
 * @category Core
 */
export const pipe = ((
    i: Iterable<unknown>,
    ...p: readonly SyncOperation<unknown, unknown>[]
) => {
    if (isAsyncIterable(i)) {
        throw new TypeError(
            'Cannot run the sync pipeline from an AsyncIterable'
        );
    }
    return extendIterable(p.reduce((c, a: any) => a(c), optimizeIterable(i)));
}) as Pipe;

/**
 * Extends an UnknownIterable object into IterableExt type.
 */
function extendIterable(i: any): IterableExt<any> | AsyncIterableExt<any> {
    Object.defineProperty(i, 'first', {get: () => i[$S]().next().value});
    i.catch = (cb: any) => extendIterable(catchError(cb)(i));
    return i;
}
