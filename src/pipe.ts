import {IterableExt, Piper} from './types';

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

export function pipe<T>(i: Iterable<T>, ...p: Piper<any, any>[]): IterableExt<any> {
    const res = p.reduce((c, a) => a(c), i);
    Object.defineProperty(res, 'first', ({
        get() {
            return this[Symbol.iterator]().next().value;
        }
    }));
    return res;
}
