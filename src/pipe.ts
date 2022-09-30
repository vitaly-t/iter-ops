import {
    $A,
    $S,
    UnknownIterable,
    AsyncIterableExt,
    IterableExt,
    Operation,
} from './types';
import {catchError} from './ops/catch-error';
import {optimizeIterable} from './utils';

/** @hidden */
export function pipe<T>(i: Iterable<T>): IterableExt<T>;

/**
 * Pipes a synchronous `Iterable` through the list of operators, and returns {@link IterableExt}.
 *
 * @see
 *  - {@link toIterable}
 *  - {@link toAsync}
 * @category Core
 */
export function pipe<T, A>(i: Iterable<T>, p0: Operation<T, A>): IterableExt<A>;

/** @hidden */
export function pipe<T, A, B>(
    i: Iterable<T>,
    p0: Operation<T, A>,
    p1: Operation<A, B>
): IterableExt<B>;
/** @hidden */
export function pipe<T, A, B, C>(
    i: Iterable<T>,
    p0: Operation<T, A>,
    p1: Operation<A, B>,
    p2: Operation<B, C>
): IterableExt<C>;
/** @hidden */
export function pipe<T, A, B, C, D>(
    i: Iterable<T>,
    p0: Operation<T, A>,
    p1: Operation<A, B>,
    p2: Operation<B, C>,
    p3: Operation<C, D>
): IterableExt<D>;
/** @hidden */
export function pipe<T, A, B, C, D, E>(
    i: Iterable<T>,
    p0: Operation<T, A>,
    p1: Operation<A, B>,
    p2: Operation<B, C>,
    p3: Operation<C, D>,
    p4: Operation<D, E>
): IterableExt<E>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F>(
    i: Iterable<T>,
    p0: Operation<T, A>,
    p1: Operation<A, B>,
    p2: Operation<B, C>,
    p3: Operation<C, D>,
    p4: Operation<D, E>,
    p5: Operation<E, F>
): IterableExt<F>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G>(
    i: Iterable<T>,
    p0: Operation<T, A>,
    p1: Operation<A, B>,
    p2: Operation<B, C>,
    p3: Operation<C, D>,
    p4: Operation<D, E>,
    p5: Operation<E, F>,
    p6: Operation<F, G>
): IterableExt<G>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H>(
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
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H, I>(
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
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H, I, J>(
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

/** @hidden */
export function pipe<T>(i: UnknownIterable<T>): AsyncIterableExt<T>;

/**
 * Pipes an `AsyncIterable` through the list of operators, and returns {@link AsyncIterableExt}.
 *
 * @see
 *  - {@link toIterable}
 *  - {@link toAsync}
 * @category Core
 */
export function pipe<T, A>(
    i: UnknownIterable<T>,
    p0: Operation<T, A>
): AsyncIterableExt<A>;

/** @hidden */
export function pipe<T, A, B>(
    i: UnknownIterable<T>,
    p0: Operation<T, A>,
    p1: Operation<A, B>
): AsyncIterableExt<B>;
/** @hidden */
export function pipe<T, A, B, C>(
    i: UnknownIterable<T>,
    p0: Operation<T, A>,
    p1: Operation<A, B>,
    p2: Operation<B, C>
): AsyncIterableExt<C>;
/** @hidden */
export function pipe<T, A, B, C, D>(
    i: UnknownIterable<T>,
    p0: Operation<T, A>,
    p1: Operation<A, B>,
    p2: Operation<B, C>,
    p3: Operation<C, D>
): AsyncIterableExt<D>;
/** @hidden */
export function pipe<T, A, B, C, D, E>(
    i: UnknownIterable<T>,
    p0: Operation<T, A>,
    p1: Operation<A, B>,
    p2: Operation<B, C>,
    p3: Operation<C, D>,
    p4: Operation<D, E>
): AsyncIterableExt<E>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F>(
    i: UnknownIterable<T>,
    p0: Operation<T, A>,
    p1: Operation<A, B>,
    p2: Operation<B, C>,
    p3: Operation<C, D>,
    p4: Operation<D, E>,
    p5: Operation<E, F>
): AsyncIterableExt<F>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G>(
    i: UnknownIterable<T>,
    p0: Operation<T, A>,
    p1: Operation<A, B>,
    p2: Operation<B, C>,
    p3: Operation<C, D>,
    p4: Operation<D, E>,
    p5: Operation<E, F>,
    p6: Operation<F, G>
): AsyncIterableExt<G>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H>(
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
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H, I>(
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
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H, I, J>(
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

export function pipe(
    i: any,
    ...p: any[]
): IterableExt<any> | AsyncIterableExt<any> {
    if (i[$S]) {
        // create synchronous pipeline:
        return extendIterable(p.reduce((c, a) => a(c), optimizeIterable(i)));
    }
    if (i[$A]) {
        // create asynchronous pipeline:
        return extendAsyncIterable(p.reduce((c, a) => a(c), i));
    }
    throw new TypeError(
        `An iterable object was expected: ${JSON.stringify(i)}`
    );
}

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
