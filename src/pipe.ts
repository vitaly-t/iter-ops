import {Piper} from './common';

export function pipe<T, A>(i: Iterable<T>, p0: Piper<T, A>): Iterable<A>;
export function pipe<T, A, B>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>): Iterable<B>;
export function pipe<T, A, B, C>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>): Iterable<C>;
export function pipe<T, A, B, C, D>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>): Iterable<D>;
export function pipe<T, A, B, C, D, E>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>): Iterable<E>;
export function pipe<T, A, B, C, D, E, F>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>, p5: Piper<E, F>): Iterable<F>;
export function pipe<T, A, B, C, D, E, F, G>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>, p5: Piper<E, F>, p6: Piper<F, G>): Iterable<G>;
export function pipe<T, A, B, C, D, E, F, G, H>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>, p5: Piper<E, F>, p6: Piper<F, G>, p7: Piper<G, H>): Iterable<H>;
export function pipe<T, A, B, C, D, E, F, G, H, I>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>, p5: Piper<E, F>, p6: Piper<F, G>, p7: Piper<G, H>, p8: Piper<H, I>): Iterable<I>;
export function pipe<T, A, B, C, D, E, F, G, H, I, J>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>, p5: Piper<E, F>, p6: Piper<F, G>, p7: Piper<G, H>, p8: Piper<H, I>, p9: Piper<I, J>): Iterable<J>;

export function pipe<T>(i: Iterable<T>, ...p: any[]): any {
    return p.reduce((c, a) => a(c), i);
}
