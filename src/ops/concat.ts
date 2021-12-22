import {Any, AnySync, Operation} from '../types';
import {createOperation} from '../shared';

/** @hidden */
export function concat<T>(): Operation<T, T>;

/**
 * Merges current iterable with a list of values, iterators or iterables.
 * Merged inputs are iterated over after depleting the current iterable, in the order in which they were specified,
 * i.e. the standard `Array.concat` logic.
 *
 * @see: [Array.concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
 *
 * @category Sync+Async
 */
export function concat<T, A>(v0: Any<A>): Operation<T, T | A>;

/** @hidden */
export function concat<T, A, B>(v0: Any<A>, v1: Any<B>): Operation<T, T | A | B>;
/** @hidden */
export function concat<T, A, B, C>(v0: Any<A>, v1: Any<B>, v2: Any<C>): Operation<T, T | A | B | C>;
/** @hidden */
export function concat<T, A, B, C, D>(v0: Any<A>, v1: Any<B>, v2: Any<C>, v3: Any<D>): Operation<T, T | A | B | C | D>;
/** @hidden */
export function concat<T, A, B, C, D, E>(v0: Any<A>, v1: Any<B>, v2: Any<C>, v3: Any<D>, v4: Any<E>): Operation<T, T | A | B | C | D | E>;
/** @hidden */
export function concat<T, A, B, C, D, E, F>(v0: Any<A>, v1: Any<B>, v2: Any<C>, v3: Any<D>, v4: Any<E>, v5: Any<F>): Operation<T, T | A | B | C | D | E | F>;
/** @hidden */
export function concat<T, A, B, C, D, E, F, G>(v0: Any<A>, v1: Any<B>, v2: Any<C>, v3: Any<D>, v4: Any<E>, v5: Any<F>, v6: Any<G>): Operation<T, T | A | B | C | D | E | F | G>;
/** @hidden */
export function concat<T, A, B, C, D, E, F, G, H>(v0: Any<A>, v1: Any<B>, v2: Any<C>, v3: Any<D>, v4: Any<E>, v5: Any<F>, v6: Any<G>, v7: Any<H>): Operation<T, T | A | B | C | D | E | F | G | H>;
/** @hidden */
export function concat<T, A, B, C, D, E, F, G, H, I>(v0: Any<A>, v1: Any<B>, v2: Any<C>, v3: Any<D>, v4: Any<E>, v5: Any<F>, v6: Any<G>, v7: Any<H>, v8: Any<I>): Operation<T, T | A | B | C | D | E | F | G | H | I>;
/** @hidden */
export function concat<T, A, B, C, D, E, F, G, H, I, J>(v0: Any<A>, v1: Any<B>, v2: Any<C>, v3: Any<D>, v4: Any<E>, v5: Any<F>, v6: Any<G>, v7: Any<H>, v8: Any<I>, v9: Any<J>): Operation<T, T | A | B | C | D | E | F | G | H | I | J>;

export function concat<T>(...values: Any<T>[]): Operation<T, any> {
    return createOperation(concatSync, concatAsync, arguments);
}

function concatSync<T>(iterable: Iterable<T>, ...values: AnySync<T>[]): Iterable<any> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = -1, k: Iterator<T>, v: any, start = true;
            return {
                next(): IteratorResult<T> {
                    if (index < 0) {
                        const a = i.next();
                        if (!a.done) {
                            return a;
                        }
                        index = 0;
                    }
                    while (index < values.length) {
                        if (start) {
                            v = values[index];
                            k = typeof v?.next === 'function' ? v : v?.[Symbol.iterator]?.();
                            start = false;
                        }
                        if (k) {
                            const b = k.next();
                            if (!b.done) {
                                return b;
                            }
                        }
                        start = true;
                        index++;
                        if (!k) {
                            return {value: v, done: false};
                        }
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function concatAsync<T>(iterable: AsyncIterable<T>, ...values: Any<T>[]): AsyncIterable<any> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            let index = -1, k: AsyncIterator<T>, v: any, start = true;
            return {
                async next(): Promise<IteratorResult<T>> {
                    if (index < 0) {
                        const a = await i.next();
                        if (!a.done) {
                            return a;
                        }
                        index = 0;
                    }
                    while (index < values.length) {
                        if (start) {
                            v = values[index];
                            k = typeof v?.next === 'function' ? v : (v?.[Symbol.iterator]?.() || v?.[Symbol.asyncIterator]?.());
                            start = false;
                        }
                        if (k) {
                            const b = await k.next();
                            if (!b.done) {
                                return b;
                            }
                        }
                        start = true;
                        index++;
                        if (!k) {
                            return {value: v, done: false};
                        }
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}
