import {Piper, Terminator} from './common';

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

export function pipe<T, R>(i: Iterable<T>, t: Terminator<T, R>): R;
export function pipe<T, R, A>(i: Iterable<T>, p0: Piper<T, A>, t: Terminator<A, R>): R;
export function pipe<T, R, A, B>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, t: Terminator<B, R>): R;
export function pipe<T, R, A, B, C>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, t: Terminator<C, R>): R;
export function pipe<T, R, A, B, C, D>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, t: Terminator<D, R>): R;

export function pipe<T, R, A, B, C, D, E>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>, t: Terminator<E, R>): R;
export function pipe<T, R, A, B, C, D, E, F>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>, p5: Piper<E, F>, t: Terminator<F, R>): R;
export function pipe<T, R, A, B, C, D, E, F, G>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>, p5: Piper<E, F>, p6: Piper<F, G>, t: Terminator<G, R>): R;
export function pipe<T, R, A, B, C, D, E, F, G, H>(i: Iterable<T>, p0: Piper<T, A>, p1: Piper<A, B>, p2: Piper<B, C>, p3: Piper<C, D>, p4: Piper<D, E>, p5: Piper<E, F>, p6: Piper<F, G>, p7: Piper<G, H>, t: Terminator<H, R>): R;

export function pipe<T>(i: Iterable<T>, ...pt: any[]): any {
    let prev: any = i;
    for (const a of pt) {
        const res = a(prev) as any;
        if (res[Symbol.iterator]) {
            prev = res;
            continue;
        }
        return res.process(prev);
    }
    return prev;
}
