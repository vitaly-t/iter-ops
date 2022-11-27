import type {
    AsyncIterableExt,
    DuelOperation,
    UnknownIterable,
    IterableExt,
} from '../types';
import {isAsyncIterable, isSyncIterable} from '../typeguards';

import {pipe as _pipeAsync} from './async';
import {pipe as _pipeSync} from './sync';

interface PipeSync {
    <T extends Iterable<unknown>>(i: T): T extends Iterable<infer E>
        ? IterableExt<E>
        : never;

    <T extends Iterable<unknown>, A>(
        i: T,
        p0: DuelOperation<T extends Iterable<infer E> ? E : never, A>
    ): IterableExt<A>;

    <T extends Iterable<unknown>, A, B>(
        i: T,
        p0: DuelOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>
    ): IterableExt<B>;

    <T extends Iterable<unknown>, A, B, C>(
        i: T,
        p0: DuelOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>
    ): IterableExt<C>;

    <T extends Iterable<unknown>, A, B, C, D>(
        i: T,
        p0: DuelOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>,
        p3: DuelOperation<C, D>
    ): IterableExt<D>;

    <T extends Iterable<unknown>, A, B, C, D, E>(
        i: T,
        p0: DuelOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>,
        p3: DuelOperation<C, D>,
        p4: DuelOperation<D, E>
    ): IterableExt<E>;

    <T extends Iterable<unknown>, A, B, C, D, E, F>(
        i: T,
        p0: DuelOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>,
        p3: DuelOperation<C, D>,
        p4: DuelOperation<D, E>,
        p5: DuelOperation<E, F>
    ): IterableExt<F>;

    <T extends Iterable<unknown>, A, B, C, D, E, F, G>(
        i: T,
        p0: DuelOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>,
        p3: DuelOperation<C, D>,
        p4: DuelOperation<D, E>,
        p5: DuelOperation<E, F>,
        p6: DuelOperation<F, G>
    ): IterableExt<G>;

    <T extends Iterable<unknown>, A, B, C, D, E, F, G, H>(
        i: T,
        p0: DuelOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>,
        p3: DuelOperation<C, D>,
        p4: DuelOperation<D, E>,
        p5: DuelOperation<E, F>,
        p6: DuelOperation<F, G>,
        p7: DuelOperation<G, H>
    ): IterableExt<H>;

    <T extends Iterable<unknown>, A, B, C, D, E, F, G, H, I>(
        i: T,
        p0: DuelOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>,
        p3: DuelOperation<C, D>,
        p4: DuelOperation<D, E>,
        p5: DuelOperation<E, F>,
        p6: DuelOperation<F, G>,
        p7: DuelOperation<G, H>,
        p8: DuelOperation<H, I>
    ): IterableExt<I>;

    <T extends Iterable<unknown>, A, B, C, D, E, F, G, H, I, J>(
        i: T,
        p0: DuelOperation<T extends Iterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>,
        p3: DuelOperation<C, D>,
        p4: DuelOperation<D, E>,
        p5: DuelOperation<E, F>,
        p6: DuelOperation<F, G>,
        p7: DuelOperation<G, H>,
        p8: DuelOperation<H, I>,
        p9: DuelOperation<I, J>
    ): IterableExt<J>;

    (
        i: Iterable<unknown>,
        ...p: readonly DuelOperation<unknown, unknown>[]
    ): IterableExt<unknown>;
}

interface PipeAsync {
    <T extends UnknownIterable<unknown>>(i: T): T extends UnknownIterable<
        infer E
    >
        ? AsyncIterableExt<E>
        : never;

    <T extends UnknownIterable<unknown>, A>(
        i: T,
        p0: DuelOperation<T extends UnknownIterable<infer E> ? E : never, A>
    ): AsyncIterableExt<A>;

    <T extends UnknownIterable<unknown>, A, B>(
        i: T,
        p0: DuelOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>
    ): AsyncIterableExt<B>;

    <T extends UnknownIterable<unknown>, A, B, C>(
        i: T,
        p0: DuelOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>
    ): AsyncIterableExt<C>;

    <T extends UnknownIterable<unknown>, A, B, C, D>(
        i: T,
        p0: DuelOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>,
        p3: DuelOperation<C, D>
    ): AsyncIterableExt<D>;

    <T extends UnknownIterable<unknown>, A, B, C, D, E>(
        i: T,
        p0: DuelOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>,
        p3: DuelOperation<C, D>,
        p4: DuelOperation<D, E>
    ): AsyncIterableExt<E>;

    <T extends UnknownIterable<unknown>, A, B, C, D, E, F>(
        i: T,
        p0: DuelOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>,
        p3: DuelOperation<C, D>,
        p4: DuelOperation<D, E>,
        p5: DuelOperation<E, F>
    ): AsyncIterableExt<F>;

    <T extends UnknownIterable<unknown>, A, B, C, D, E, F, G>(
        i: T,
        p0: DuelOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>,
        p3: DuelOperation<C, D>,
        p4: DuelOperation<D, E>,
        p5: DuelOperation<E, F>,
        p6: DuelOperation<F, G>
    ): AsyncIterableExt<G>;

    <T extends UnknownIterable<unknown>, A, B, C, D, E, F, G, H>(
        i: T,
        p0: DuelOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>,
        p3: DuelOperation<C, D>,
        p4: DuelOperation<D, E>,
        p5: DuelOperation<E, F>,
        p6: DuelOperation<F, G>,
        p7: DuelOperation<G, H>
    ): AsyncIterableExt<H>;

    <T extends UnknownIterable<unknown>, A, B, C, D, E, F, G, H, I>(
        i: T,
        p0: DuelOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>,
        p3: DuelOperation<C, D>,
        p4: DuelOperation<D, E>,
        p5: DuelOperation<E, F>,
        p6: DuelOperation<F, G>,
        p7: DuelOperation<G, H>,
        p8: DuelOperation<H, I>
    ): AsyncIterableExt<I>;

    <T extends UnknownIterable<unknown>, A, B, C, D, E, F, G, H, I, J>(
        i: T,
        p0: DuelOperation<T extends UnknownIterable<infer E> ? E : never, A>,
        p1: DuelOperation<A, B>,
        p2: DuelOperation<B, C>,
        p3: DuelOperation<C, D>,
        p4: DuelOperation<D, E>,
        p5: DuelOperation<E, F>,
        p6: DuelOperation<F, G>,
        p7: DuelOperation<G, H>,
        p8: DuelOperation<H, I>,
        p9: DuelOperation<I, J>
    ): AsyncIterableExt<J>;

    (
        i: UnknownIterable<unknown>,
        ...p: readonly DuelOperation<unknown, unknown>[]
    ): AsyncIterableExt<unknown>;
}

type Pipe = PipeSync & PipeAsync;

/**
 * Pipes an `Iterable` or `AsyncIterable` through the list of operators, and returns either {@link IterableExt} or {@link AsyncIterableExt}.
 *
 * @throws `TypeError: 'An iterable object was expected: ...'` when the input is not iterable.
 *
 * @see
 *  - {@link pipeSync}
 *  - {@link pipeAsync}
 *  - {@link toIterable}
 *  - {@link toAsync}
 *
 * @category Core
 */
export const pipe = ((
    ...[i, ...p]:
        | [
              UnknownIterable<unknown>,
              ...(readonly DuelOperation<unknown, unknown>[])
          ]
        | [
              AsyncIterable<unknown>,
              ...(readonly DuelOperation<unknown, unknown>[])
          ]
) => {
    if (isSyncIterable(i)) {
        return pipeSync(i, ...p);
    }
    if (isAsyncIterable(i)) {
        return pipeAsync(i, ...p);
    }
    throw new TypeError(
        `An iterable object was expected: ${JSON.stringify(i)}`
    );
}) as Pipe;

/**
 * Pipes a synchronous `Iterable` through the list of synchronous operators, and returns {@link IterableExt}.
 *
 * @deprecated Use the {@link sync.pipe | sync scoped pipe} instead.
 *
 * @see
 *  - {@link pipe}
 *  - {@link sync.pipe | sync scoped pipe}
 *  - {@link async.pipe | async scoped pipe}
 *
 * @throws `TypeError: 'Cannot run the sync pipeline from an AsyncIterable'` when the iterable is asynchronous.
 *
 * @category Core
 */
export const pipeSync = _pipeSync as PipeSync;

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
 * @deprecated Use the  {@link async.pipe | async scoped pipe} instead.
 *
 * @see
 *  - {@link pipe}
 *  - {@link sync.pipe | sync scoped pipe}
 *  - {@link async.pipe | async scoped pipe}
 *
 * @category Core
 */
export const pipeAsync = _pipeAsync as PipeAsync;
