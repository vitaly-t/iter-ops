import {
    $A,
    $S,
    UnknownIterable,
    AsyncIterableExt,
    IterableExt,
    SyncOperation,
    AsyncOperation,
} from './types';
import {catchError} from './ops/catch-error';
import {optimizeIterable} from './utils';
import {isAsyncIterable, isSyncIterable} from './typeguards';

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
export function pipe<T, A>(
    i: Iterable<T>,
    p0: SyncOperation<T, A>
): IterableExt<A>;

/** @hidden */
export function pipe<T, A, B>(
    i: Iterable<T>,
    p0: SyncOperation<T, A>,
    p1: SyncOperation<A, B>
): IterableExt<B>;
/** @hidden */
export function pipe<T, A, B, C>(
    i: Iterable<T>,
    p0: SyncOperation<T, A>,
    p1: SyncOperation<A, B>,
    p2: SyncOperation<B, C>
): IterableExt<C>;
/** @hidden */
export function pipe<T, A, B, C, D>(
    i: Iterable<T>,
    p0: SyncOperation<T, A>,
    p1: SyncOperation<A, B>,
    p2: SyncOperation<B, C>,
    p3: SyncOperation<C, D>
): IterableExt<D>;
/** @hidden */
export function pipe<T, A, B, C, D, E>(
    i: Iterable<T>,
    p0: SyncOperation<T, A>,
    p1: SyncOperation<A, B>,
    p2: SyncOperation<B, C>,
    p3: SyncOperation<C, D>,
    p4: SyncOperation<D, E>
): IterableExt<E>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F>(
    i: Iterable<T>,
    p0: SyncOperation<T, A>,
    p1: SyncOperation<A, B>,
    p2: SyncOperation<B, C>,
    p3: SyncOperation<C, D>,
    p4: SyncOperation<D, E>,
    p5: SyncOperation<E, F>
): IterableExt<F>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G>(
    i: Iterable<T>,
    p0: SyncOperation<T, A>,
    p1: SyncOperation<A, B>,
    p2: SyncOperation<B, C>,
    p3: SyncOperation<C, D>,
    p4: SyncOperation<D, E>,
    p5: SyncOperation<E, F>,
    p6: SyncOperation<F, G>
): IterableExt<G>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H>(
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
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H, I>(
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
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H, I, J>(
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
    p0: AsyncOperation<T, A>
): AsyncIterableExt<A>;

/** @hidden */
export function pipe<T, A, B>(
    i: UnknownIterable<T>,
    p0: AsyncOperation<T, A>,
    p1: AsyncOperation<A, B>
): AsyncIterableExt<B>;
/** @hidden */
export function pipe<T, A, B, C>(
    i: UnknownIterable<T>,
    p0: AsyncOperation<T, A>,
    p1: AsyncOperation<A, B>,
    p2: AsyncOperation<B, C>
): AsyncIterableExt<C>;
/** @hidden */
export function pipe<T, A, B, C, D>(
    i: UnknownIterable<T>,
    p0: AsyncOperation<T, A>,
    p1: AsyncOperation<A, B>,
    p2: AsyncOperation<B, C>,
    p3: AsyncOperation<C, D>
): AsyncIterableExt<D>;
/** @hidden */
export function pipe<T, A, B, C, D, E>(
    i: UnknownIterable<T>,
    p0: AsyncOperation<T, A>,
    p1: AsyncOperation<A, B>,
    p2: AsyncOperation<B, C>,
    p3: AsyncOperation<C, D>,
    p4: AsyncOperation<D, E>
): AsyncIterableExt<E>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F>(
    i: UnknownIterable<T>,
    p0: AsyncOperation<T, A>,
    p1: AsyncOperation<A, B>,
    p2: AsyncOperation<B, C>,
    p3: AsyncOperation<C, D>,
    p4: AsyncOperation<D, E>,
    p5: AsyncOperation<E, F>
): AsyncIterableExt<F>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G>(
    i: UnknownIterable<T>,
    p0: AsyncOperation<T, A>,
    p1: AsyncOperation<A, B>,
    p2: AsyncOperation<B, C>,
    p3: AsyncOperation<C, D>,
    p4: AsyncOperation<D, E>,
    p5: AsyncOperation<E, F>,
    p6: AsyncOperation<F, G>
): AsyncIterableExt<G>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H>(
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
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H, I>(
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
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H, I, J>(
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

export function pipe(
    i: any,
    ...p: any[]
): IterableExt<any> | AsyncIterableExt<any> {
    if (isSyncIterable(i)) {
        // create synchronous pipeline:
        return extendIterable(p.reduce((c, a) => a(c), optimizeIterable(i)));
    }
    if (isAsyncIterable(i)) {
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
