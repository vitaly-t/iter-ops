import {Piper} from '../types';

type VI<T> = T | Iterable<T>; // Value or Iterable

export function concat<T, A>(v0: VI<A>): Piper<T, T | A>;
export function concat<T, A, B>(v0: VI<A>, v1: VI<B>): Piper<T, T | A | B>;
export function concat<T, A, B, C>(v0: VI<A>, v1: VI<B>, v2: VI<C>): Piper<T, T | A | B | C>;
export function concat<T, A, B, C, D>(v0: VI<A>, v1: VI<B>, v2: VI<C>, v3: VI<D>): Piper<T, T | A | B | C | D>;
export function concat<T, A, B, C, D, E>(v0: VI<A>, v1: VI<B>, v2: VI<C>, v3: VI<D>, v4: VI<E>): Piper<T, T | A | B | C | D | E>;
export function concat<T, A, B, C, D, E, F>(v0: VI<A>, v1: VI<B>, v2: VI<C>, v3: VI<D>, v4: VI<E>, v5: VI<F>): Piper<T, T | A | B | C | D | E | F>;
export function concat<T, A, B, C, D, E, F, G>(v0: VI<A>, v1: VI<B>, v2: VI<C>, v3: VI<D>, v4: VI<E>, v5: VI<F>, v6: VI<G>): Piper<T, T | A | B | C | D | E | F | G>;
export function concat<T, A, B, C, D, E, F, G, H>(v0: VI<A>, v1: VI<B>, v2: VI<C>, v3: VI<D>, v4: VI<E>, v5: VI<F>, v6: VI<G>, v7: VI<H>): Piper<T, T | A | B | C | D | E | F | G | H>;
export function concat<T, A, B, C, D, E, F, G, H, I>(v0: VI<A>, v1: VI<B>, v2: VI<C>, v3: VI<D>, v4: VI<E>, v5: VI<F>, v6: VI<G>, v7: VI<H>, v8: VI<I>): Piper<T, T | A | B | C | D | E | F | G | H | I>;
export function concat<T, A, B, C, D, E, F, G, H, I, J>(v0: VI<A>, v1: VI<B>, v2: VI<C>, v3: VI<D>, v4: VI<E>, v5: VI<F>, v6: VI<G>, v7: VI<H>, v8: VI<I>, v9: VI<J>): Piper<T, T | A | B | C | D | E | F | G | H | I | J>;

/**
 * Logically merges current iterable with a list of values or iterables.
 * Merged values are iterated over after the current iterable is depleted.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
 */
export function concat<T>(...values: any[]): Piper<T, any> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            return {
                next(): IteratorResult<T> {
                    // TODO: to be implemented
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
