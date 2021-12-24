import {$A, $S, AnyIterable, AsyncIterableExt, IterableExt, Operation} from './types';
import {catchError} from './ops/catch-error';
import {optimizeIterable} from './utils';

/** @hidden */
export function pipe<T>(i: Iterable<T>): IterableExt<T>;

/**
 * Pipes a synchronous iterable through the list of operators, and returns [[IterableExt]].
 *
 * @category Core
 */
export function pipe<T, A>(i: Iterable<T>, p0: Operation<T, A>): IterableExt<A>;

/** @hidden */
export function pipe<T, A, B>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>): IterableExt<B>;
/** @hidden */
export function pipe<T, A, B, C>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>): IterableExt<C>;
/** @hidden */
export function pipe<T, A, B, C, D>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>): IterableExt<D>;
/** @hidden */
export function pipe<T, A, B, C, D, E>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>): IterableExt<E>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>): IterableExt<F>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>): IterableExt<G>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>, p7: Operation<G, H>): IterableExt<H>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H, I>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>, p7: Operation<G, H>, p8: Operation<H, I>): IterableExt<I>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H, I, J>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>, p7: Operation<G, H>, p8: Operation<H, I>, p9: Operation<I, J>): IterableExt<J>;

/** @hidden */
export function pipe<T>(i: AnyIterable<T>): AsyncIterableExt<T>;

/**
 * Pipes an asynchronous iterable through the list of operators, and returns [[AsyncIterableExt]].
 *
 * @category Core
 */
export function pipe<T, A>(i: AnyIterable<T>, p0: Operation<T, A>): AsyncIterableExt<A>;

/** @hidden */
export function pipe<T, A, B>(i: AnyIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>): AsyncIterableExt<B>;
/** @hidden */
export function pipe<T, A, B, C>(i: AnyIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>): AsyncIterableExt<C>;
/** @hidden */
export function pipe<T, A, B, C, D>(i: AnyIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>): AsyncIterableExt<D>;
/** @hidden */
export function pipe<T, A, B, C, D, E>(i: AnyIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>): AsyncIterableExt<E>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F>(i: AnyIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>): AsyncIterableExt<F>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G>(i: AnyIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>): AsyncIterableExt<G>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H>(i: AnyIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>, p7: Operation<G, H>): AsyncIterableExt<H>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H, I>(i: AnyIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>, p7: Operation<G, H>, p8: Operation<H, I>): AsyncIterableExt<I>;
/** @hidden */
export function pipe<T, A, B, C, D, E, F, G, H, I, J>(i: AnyIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>, p7: Operation<G, H>, p8: Operation<H, I>, p9: Operation<I, J>): AsyncIterableExt<J>;

export function pipe(i: any, ...p: any[]): IterableExt<any> | AsyncIterableExt<any> {
    if (i[$S]) {
        return extendIterable(p.reduce((c, a) => a(c), optimizeIterable(i)));
    }
    return extendAsyncIterable(p.reduce((c, a) => a(c), i));
}

/**
 * Extends an Iterable object into IterableExt type.
 */
function extendIterable(i: any): IterableExt<any> {
    Object.defineProperty(i, 'first', ({get: () => i[$S]().next().value}));
    i.catch = (cb: any) => extendIterable(catchError(cb)(i));
    return i;
}

/**
 * Extends an AsyncIterable object into AsyncIterableExt type.
 */
function extendAsyncIterable(i: any): AsyncIterableExt<any> {
    Object.defineProperty(i, 'first', ({get: () => i[$A]().next().then((a: any) => a.value)}));
    i.catch = (cb: any) => extendAsyncIterable(catchError(cb)(i));
    return i;
}
