import {AsyncIterableExt, AsyncPiper, IterableExt, Piper} from './types';
import {extendAsyncIterable, extendIterable, optimizeIterable} from './utils';

/**
 * Pipes an iterable through the list of operators, and returns an extended iterable.
 */
export function pipe<T>(i: Iterable<T>): IterableExt<T>;
export function pipe<T, A>(i: Iterable<T>, p0: Piper<T, A>): IterableExt<A>;
export function pipe<T, A, B>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>): IterableExt<B>;
export function pipe<T, A, B, C>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>): IterableExt<C>;
export function pipe<T, A, B, C, D>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>): IterableExt<D>;
export function pipe<T, A, B, C, D, E>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>): IterableExt<E>;
export function pipe<T, A, B, C, D, E, F>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>, p5: Piper<E, F>): IterableExt<F>;
export function pipe<T, A, B, C, D, E, F, G>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>, p5: Piper<E, F>, p6: Piper<F, G>): IterableExt<G>;
export function pipe<T, A, B, C, D, E, F, G, H>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>, p5: Piper<E, F>, p6: Piper<F, G>, p7: Piper<G, H>): IterableExt<H>;
export function pipe<T, A, B, C, D, E, F, G, H, I>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>, p5: Piper<E, F>, p6: Piper<F, G>, p7: Piper<G, H>, p8: Piper<H, I>): IterableExt<I>;
export function pipe<T, A, B, C, D, E, F, G, H, I, J>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>, p5: Piper<E, F>, p6: Piper<F, G>, p7: Piper<G, H>, p8: Piper<H, I>, p9: Piper<I, J>): IterableExt<J>;

/**
 * Pipes an asynchronous iterable through the list of operators, and returns an extended iterable.
 */
export function pipe<T>(i: AsyncIterable<T>): AsyncIterableExt<T>;
export function pipe<T, A>(i: AsyncIterable<T>, p0: AsyncPiper<T, A>): AsyncIterableExt<A>;
export function pipe<T, A, B>(i: AsyncIterable<T>, p0: AsyncPiper<T, A>, p1: AsyncPiper<A, B>): AsyncIterableExt<B>;
export function pipe<T, A, B, C>(i: AsyncIterable<T>, p0: AsyncPiper<T, A>, p1: AsyncPiper<A, B>, p2: AsyncPiper<B, C>): AsyncIterableExt<C>;
export function pipe<T, A, B, C, D>(i: AsyncIterable<T>, p0: AsyncPiper<T, A>, p1: AsyncPiper<A, B>, p2: AsyncPiper<B, C>, p3: AsyncPiper<C, D>): AsyncIterableExt<D>;
export function pipe<T, A, B, C, D, E>(i: AsyncIterable<T>, p0: AsyncPiper<T, A>, p1: AsyncPiper<A, B>, p2: AsyncPiper<B, C>, p3: AsyncPiper<C, D>, p4: AsyncPiper<D, E>): AsyncIterableExt<E>;
export function pipe<T, A, B, C, D, E, F>(i: AsyncIterable<T>, p0: AsyncPiper<T, A>, p1: AsyncPiper<A, B>, p2: AsyncPiper<B, C>, p3: AsyncPiper<C, D>, p4: AsyncPiper<D, E>, p5: AsyncPiper<E, F>): AsyncIterableExt<F>;
export function pipe<T, A, B, C, D, E, F, G>(i: AsyncIterable<T>, p0: AsyncPiper<T, A>, p1: AsyncPiper<A, B>, p2: AsyncPiper<B, C>, p3: AsyncPiper<C, D>, p4: AsyncPiper<D, E>, p5: AsyncPiper<E, F>, p6: AsyncPiper<F, G>): AsyncIterableExt<G>;
export function pipe<T, A, B, C, D, E, F, G, H>(i: AsyncIterable<T>, p0: AsyncPiper<T, A>, p1: AsyncPiper<A, B>, p2: AsyncPiper<B, C>, p3: AsyncPiper<C, D>, p4: AsyncPiper<D, E>, p5: AsyncPiper<E, F>, p6: AsyncPiper<F, G>, p7: AsyncPiper<G, H>): AsyncIterableExt<H>;
export function pipe<T, A, B, C, D, E, F, G, H, I>(i: AsyncIterable<T>, p0: AsyncPiper<T, A>, p1: AsyncPiper<A, B>, p2: AsyncPiper<B, C>, p3: AsyncPiper<C, D>, p4: AsyncPiper<D, E>, p5: AsyncPiper<E, F>, p6: AsyncPiper<F, G>, p7: AsyncPiper<G, H>, p8: AsyncPiper<H, I>): AsyncIterableExt<I>;
export function pipe<T, A, B, C, D, E, F, G, H, I, J>(i: AsyncIterable<T>, p0: AsyncPiper<T, A>, p1: AsyncPiper<A, B>, p2: AsyncPiper<B, C>, p3: AsyncPiper<C, D>, p4: AsyncPiper<D, E>, p5: AsyncPiper<E, F>, p6: AsyncPiper<F, G>, p7: AsyncPiper<G, H>, p8: AsyncPiper<H, I>, p9: AsyncPiper<I, J>): AsyncIterableExt<J>;

export function pipe(i: any, ...p: any[]): IterableExt<any> | AsyncIterableExt<any> {
    if (i[Symbol.iterator]) {
        return extendIterable(p.reduce((c, a) => a(c), optimizeIterable(i)));
    }
    if (i[Symbol.asyncIterator]) {
        return extendAsyncIterable(p.reduce((c, a) => a(c), i));
    }
    throw new Error('not an iterator');
}
