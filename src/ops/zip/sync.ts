import {$S, SyncOperation} from '../../types';
import {validateZipIterators} from './common';

/**
 * Zips values together by index, into an array, while all sources continue emitting.
 *
 * ```ts
 * import {pipe, zip} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     zip('hello') // <- any number of arguments
 * );
 *
 * console.log(...i); //=> [1, 'h'], [2, 'e'], [3, 'l']
 * ```
 *
 * The operator takes any number of iterable or iterator arguments.
 *
 * @throws `TypeError: 'Value at index X is not iterable: ...'` when a non-iterable value encountered.
 *
 * @category Operations
 */
export function zip<T>(): SyncOperation<T, [T]>;
/** @hidden */
export function zip<T, A>(
    v0: Iterable<A> | Iterator<A>
): SyncOperation<T, [T, A]>;
/** @hidden */
export function zip<T, A, B>(
    v0: Iterable<A> | Iterator<A>,
    v1: Iterable<B> | Iterator<B>
): SyncOperation<T, [T, A, B]>;
/** @hidden */
export function zip<T, A, B, C>(
    v0: Iterable<A> | Iterator<A>,
    v1: Iterable<B> | Iterator<B>,
    v2: Iterable<C> | Iterator<C>
): SyncOperation<T, [T, A, B, C]>;
/** @hidden */
export function zip<T, A, B, C, D>(
    v0: Iterable<A> | Iterator<A>,
    v1: Iterable<B> | Iterator<B>,
    v2: Iterable<C> | Iterator<C>,
    v3: Iterable<D> | Iterator<D>
): SyncOperation<T, [T, A, B, C, D]>;
/** @hidden */
export function zip<T, A, B, C, D, E>(
    v0: Iterable<A> | Iterator<A>,
    v1: Iterable<B> | Iterator<B>,
    v2: Iterable<C> | Iterator<C>,
    v3: Iterable<D> | Iterator<D>,
    v4: Iterable<E> | Iterator<E>
): SyncOperation<T, [T, A, B, C, D, E]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F>(
    v0: Iterable<A> | Iterator<A>,
    v1: Iterable<B> | Iterator<B>,
    v2: Iterable<C> | Iterator<C>,
    v3: Iterable<D> | Iterator<D>,
    v4: Iterable<E> | Iterator<E>,
    v5: Iterable<F> | Iterator<F>
): SyncOperation<T, [T, A, B, C, D, E, F]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G>(
    v0: Iterable<A> | Iterator<A>,
    v1: Iterable<B> | Iterator<B>,
    v2: Iterable<C> | Iterator<C>,
    v3: Iterable<D> | Iterator<D>,
    v4: Iterable<E> | Iterator<E>,
    v5: Iterable<F> | Iterator<F>,
    v6: Iterable<G> | Iterator<G>
): SyncOperation<T, [T, A, B, C, D, E, F, G]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G, H>(
    v0: Iterable<A> | Iterator<A>,
    v1: Iterable<B> | Iterator<B>,
    v2: Iterable<C> | Iterator<C>,
    v3: Iterable<D> | Iterator<D>,
    v4: Iterable<E> | Iterator<E>,
    v5: Iterable<F> | Iterator<F>,
    v6: Iterable<G> | Iterator<G>,
    v7: Iterable<H> | Iterator<H>
): SyncOperation<T, [T, A, B, C, D, E, F, G, H]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G, H, I>(
    v0: Iterable<A> | Iterator<A>,
    v1: Iterable<B> | Iterator<B>,
    v2: Iterable<C> | Iterator<C>,
    v3: Iterable<D> | Iterator<D>,
    v4: Iterable<E> | Iterator<E>,
    v5: Iterable<F> | Iterator<F>,
    v6: Iterable<G> | Iterator<G>,
    v7: Iterable<H> | Iterator<H>,
    v8: Iterable<I> | Iterator<I>
): SyncOperation<T, [T, A, B, C, D, E, F, G, H, I]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G, H, I, J>(
    v0: Iterable<A> | Iterator<A>,
    v1: Iterable<B> | Iterator<B>,
    v2: Iterable<C> | Iterator<C>,
    v3: Iterable<D> | Iterator<D>,
    v4: Iterable<E> | Iterator<E>,
    v5: Iterable<F> | Iterator<F>,
    v6: Iterable<G> | Iterator<G>,
    v7: Iterable<H> | Iterator<H>,
    v8: Iterable<I> | Iterator<I>,
    v9: Iterable<J> | Iterator<J>
): SyncOperation<T, [T, A, B, C, D, E, F, G, H, I, J]>;
/** @hidden */
export function zip<T>(
    ...values: (Iterator<T> | Iterable<T>)[]
): SyncOperation<T, Array<unknown>> {
    return (iterable) => ({
        [$S](): Iterator<Array<unknown>> {
            const list: Iterator<unknown>[] = [
                iterable[$S](),
                ...values.map((v: any) =>
                    typeof v[$S] === 'function' ? v[$S]() : v
                ),
            ];
            const errIterator = validateZipIterators(true, list);
            let finished: boolean;
            return (
                errIterator || {
                    next(): IteratorResult<Array<unknown>> {
                        if (!finished) {
                            const value = [];
                            for (let i = 0; i < list.length; i++) {
                                const v = list[i].next();
                                if (v.done) {
                                    finished = true;
                                    return v;
                                }
                                value.push(v.value);
                            }
                            return {value, done: false};
                        }
                        return {value: undefined, done: true};
                    },
                }
            );
        },
    });
}
