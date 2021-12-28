import {$A, $S, Any, AnySync, Operation} from '../types';
import {createOperation} from '../utils';

/** @hidden */
export function concat<T>(): Operation<T, T>;

/**
 * Merges current iterable with a list of values, iterators or iterables.
 * Merged inputs are iterated over after depleting the current iterable, in the order in which they were specified,
 * i.e. the standard `Array.concat` logic.
 *
 * Note that if you concatenate asynchronous iterables with a synchronous pipeline, they will be processed as simple values.
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

export function concat(...args: unknown[]) {
    return createOperation(concatSync, concatAsync, args);
}

function concatSync<T>(iterable: Iterable<T>, ...values: AnySync<T>[]): Iterable<any> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
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
                            k = typeof v?.next === 'function' ? v : v?.[$S]?.();
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
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
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
                            k = typeof v?.next === 'function' ? v : (v?.[$S]?.() || v?.[$A]?.());
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
