import {AsyncIterableExt, IterableExt, Operation} from './types';
import {extendAsyncIterable, extendIterable, optimizeIterable} from './utils';

/**
 * Pipes an iterable through the list of operators, and returns an extended iterable.
 */
export function pipe<T>(i: Iterable<T>): IterableExt<T>;
export function pipe<T, A>(i: Iterable<T>, p0: Operation<T, A>): IterableExt<A>;
export function pipe<T, A, B>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>): IterableExt<B>;
export function pipe<T, A, B, C>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>): IterableExt<C>;
export function pipe<T, A, B, C, D>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>): IterableExt<D>;
export function pipe<T, A, B, C, D, E>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>): IterableExt<E>;
export function pipe<T, A, B, C, D, E, F>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>): IterableExt<F>;
export function pipe<T, A, B, C, D, E, F, G>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>): IterableExt<G>;
export function pipe<T, A, B, C, D, E, F, G, H>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>, p7: Operation<G, H>): IterableExt<H>;
export function pipe<T, A, B, C, D, E, F, G, H, I>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>, p7: Operation<G, H>, p8: Operation<H, I>): IterableExt<I>;
export function pipe<T, A, B, C, D, E, F, G, H, I, J>(i: Iterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>, p7: Operation<G, H>, p8: Operation<H, I>, p9: Operation<I, J>): IterableExt<J>;

/**
 * Pipes an asynchronous iterable through the list of operators, and returns an extended iterable.
 */
export function pipe<T>(i: AsyncIterable<T>): AsyncIterableExt<T>;
export function pipe<T, A>(i: AsyncIterable<T>, p0: Operation<T, A>): AsyncIterableExt<A>;
export function pipe<T, A, B>(i: AsyncIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>): AsyncIterableExt<B>;
export function pipe<T, A, B, C>(i: AsyncIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>): AsyncIterableExt<C>;
export function pipe<T, A, B, C, D>(i: AsyncIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>): AsyncIterableExt<D>;
export function pipe<T, A, B, C, D, E>(i: AsyncIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>): AsyncIterableExt<E>;
export function pipe<T, A, B, C, D, E, F>(i: AsyncIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>): AsyncIterableExt<F>;
export function pipe<T, A, B, C, D, E, F, G>(i: AsyncIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>): AsyncIterableExt<G>;
export function pipe<T, A, B, C, D, E, F, G, H>(i: AsyncIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>, p7: Operation<G, H>): AsyncIterableExt<H>;
export function pipe<T, A, B, C, D, E, F, G, H, I>(i: AsyncIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>, p7: Operation<G, H>, p8: Operation<H, I>): AsyncIterableExt<I>;
export function pipe<T, A, B, C, D, E, F, G, H, I, J>(i: AsyncIterable<T>, p0: Operation<T, A>, p1: Operation<A, B>, p2: Operation<B, C>, p3: Operation<C, D>, p4: Operation<D, E>, p5: Operation<E, F>, p6: Operation<F, G>, p7: Operation<G, H>, p8: Operation<H, I>, p9: Operation<I, J>): AsyncIterableExt<J>;

export function pipe(i: any, ...p: any[]): IterableExt<any> | AsyncIterableExt<any> {
    if (i[Symbol.iterator]) {
        return extendIterable(p.reduce((c, a) => a(c), optimizeIterable(i)));
    }
    if (i[Symbol.asyncIterator]) {
        return extendAsyncIterable(p.reduce((c, a) => a(c), i));
    }
    throw new Error('not an iterator');
}
