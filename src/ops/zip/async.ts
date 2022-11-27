import {$S, $A, AsyncOperation} from '../../types';
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
export function zip<T>(): AsyncOperation<T, [T]>;
/** @hidden */
export function zip<T, A>(
    v0: Iterable<A> | Iterator<A> | AsyncIterable<A> | AsyncIterator<A>
): AsyncOperation<T, [T, A]>;
/** @hidden */
export function zip<T, A, B>(
    v0: Iterable<A> | Iterator<A> | AsyncIterable<A> | AsyncIterator<A>,
    v1: Iterable<B> | Iterator<B> | AsyncIterable<B> | AsyncIterator<B>
): AsyncOperation<T, [T, A, B]>;
/** @hidden */
export function zip<T, A, B, C>(
    v0: Iterable<A> | Iterator<A> | AsyncIterable<A> | AsyncIterator<A>,
    v1: Iterable<B> | Iterator<B> | AsyncIterable<B> | AsyncIterator<B>,
    v2: Iterable<C> | Iterator<C> | AsyncIterable<C> | AsyncIterator<C>
): AsyncOperation<T, [T, A, B, C]>;
/** @hidden */
export function zip<T, A, B, C, D>(
    v0: Iterable<A> | Iterator<A> | AsyncIterable<A> | AsyncIterator<A>,
    v1: Iterable<B> | Iterator<B> | AsyncIterable<B> | AsyncIterator<B>,
    v2: Iterable<C> | Iterator<C> | AsyncIterable<C> | AsyncIterator<C>,
    v3: Iterable<D> | Iterator<D> | AsyncIterable<D> | AsyncIterator<D>
): AsyncOperation<T, [T, A, B, C, D]>;
/** @hidden */
export function zip<T, A, B, C, D, E>(
    v0: Iterable<A> | Iterator<A> | AsyncIterable<A> | AsyncIterator<A>,
    v1: Iterable<B> | Iterator<B> | AsyncIterable<B> | AsyncIterator<B>,
    v2: Iterable<C> | Iterator<C> | AsyncIterable<C> | AsyncIterator<C>,
    v3: Iterable<D> | Iterator<D> | AsyncIterable<D> | AsyncIterator<D>,
    v4: Iterable<E> | Iterator<E> | AsyncIterable<E> | AsyncIterator<E>
): AsyncOperation<T, [T, A, B, C, D, E]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F>(
    v0: Iterable<A> | Iterator<A> | AsyncIterable<A> | AsyncIterator<A>,
    v1: Iterable<B> | Iterator<B> | AsyncIterable<B> | AsyncIterator<B>,
    v2: Iterable<C> | Iterator<C> | AsyncIterable<C> | AsyncIterator<C>,
    v3: Iterable<D> | Iterator<D> | AsyncIterable<D> | AsyncIterator<D>,
    v4: Iterable<E> | Iterator<E> | AsyncIterable<E> | AsyncIterator<E>,
    v5: Iterable<F> | Iterator<F> | AsyncIterable<F> | AsyncIterator<F>
): AsyncOperation<T, [T, A, B, C, D, E, F]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G>(
    v0: Iterable<A> | Iterator<A> | AsyncIterable<A> | AsyncIterator<A>,
    v1: Iterable<B> | Iterator<B> | AsyncIterable<B> | AsyncIterator<B>,
    v2: Iterable<C> | Iterator<C> | AsyncIterable<C> | AsyncIterator<C>,
    v3: Iterable<D> | Iterator<D> | AsyncIterable<D> | AsyncIterator<D>,
    v4: Iterable<E> | Iterator<E> | AsyncIterable<E> | AsyncIterator<E>,
    v5: Iterable<F> | Iterator<F> | AsyncIterable<F> | AsyncIterator<F>,
    v6: Iterable<G> | Iterator<G> | AsyncIterable<G> | AsyncIterator<G>
): AsyncOperation<T, [T, A, B, C, D, E, F, G]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G, H>(
    v0: Iterable<A> | Iterator<A> | AsyncIterable<A> | AsyncIterator<A>,
    v1: Iterable<B> | Iterator<B> | AsyncIterable<B> | AsyncIterator<B>,
    v2: Iterable<C> | Iterator<C> | AsyncIterable<C> | AsyncIterator<C>,
    v3: Iterable<D> | Iterator<D> | AsyncIterable<D> | AsyncIterator<D>,
    v4: Iterable<E> | Iterator<E> | AsyncIterable<E> | AsyncIterator<E>,
    v5: Iterable<F> | Iterator<F> | AsyncIterable<F> | AsyncIterator<F>,
    v6: Iterable<G> | Iterator<G> | AsyncIterable<G> | AsyncIterator<G>,
    v7: Iterable<H> | Iterator<H> | AsyncIterable<H> | AsyncIterator<H>
): AsyncOperation<T, [T, A, B, C, D, E, F, G, H]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G, H, I>(
    v0: Iterable<A> | Iterator<A> | AsyncIterable<A> | AsyncIterator<A>,
    v1: Iterable<B> | Iterator<B> | AsyncIterable<B> | AsyncIterator<B>,
    v2: Iterable<C> | Iterator<C> | AsyncIterable<C> | AsyncIterator<C>,
    v3: Iterable<D> | Iterator<D> | AsyncIterable<D> | AsyncIterator<D>,
    v4: Iterable<E> | Iterator<E> | AsyncIterable<E> | AsyncIterator<E>,
    v5: Iterable<F> | Iterator<F> | AsyncIterable<F> | AsyncIterator<F>,
    v6: Iterable<G> | Iterator<G> | AsyncIterable<G> | AsyncIterator<G>,
    v7: Iterable<H> | Iterator<H> | AsyncIterable<H> | AsyncIterator<H>,
    v8: Iterable<I> | Iterator<I> | AsyncIterable<I> | AsyncIterator<I>
): AsyncOperation<T, [T, A, B, C, D, E, F, G, H, I]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G, H, I, J>(
    v0: Iterable<A> | Iterator<A> | AsyncIterable<A> | AsyncIterator<A>,
    v1: Iterable<B> | Iterator<B> | AsyncIterable<B> | AsyncIterator<B>,
    v2: Iterable<C> | Iterator<C> | AsyncIterable<C> | AsyncIterator<C>,
    v3: Iterable<D> | Iterator<D> | AsyncIterable<D> | AsyncIterator<D>,
    v4: Iterable<E> | Iterator<E> | AsyncIterable<E> | AsyncIterator<E>,
    v5: Iterable<F> | Iterator<F> | AsyncIterable<F> | AsyncIterator<F>,
    v6: Iterable<G> | Iterator<G> | AsyncIterable<G> | AsyncIterator<G>,
    v7: Iterable<H> | Iterator<H> | AsyncIterable<H> | AsyncIterator<H>,
    v8: Iterable<I> | Iterator<I> | AsyncIterable<I> | AsyncIterator<I>,
    v9: Iterable<J> | Iterator<J> | AsyncIterable<J> | AsyncIterator<J>
): AsyncOperation<T, [T, A, B, C, D, E, F, G, H, I, J]>;

export function zip<T>(
    ...values: (
        | Iterable<unknown>
        | Iterator<unknown>
        | AsyncIterable<unknown>
        | AsyncIterator<unknown>
    )[]
): AsyncOperation<T, Array<unknown>> {
    return (iterable) => ({
        [$A](): AsyncIterator<Array<T>> {
            const list: (Iterator<any> | AsyncIterator<any>)[] = [
                iterable[$A](),
                ...values.map((v: any) =>
                    typeof v[$S] === 'function'
                        ? v[$S]()
                        : typeof v[$A] === 'function'
                        ? v[$A]()
                        : v
                ),
            ];
            const errIterator = validateZipIterators(false, list);
            let finished: boolean;
            return (
                errIterator || {
                    next(): Promise<IteratorResult<Array<unknown>>> {
                        if (!finished) {
                            return Promise.all(list.map((i) => i.next())).then(
                                (a) => {
                                    const value = [];
                                    for (let i = 0; i < a.length; i++) {
                                        if (a[i].done) {
                                            finished = true;
                                            return a[i];
                                        }
                                        value.push(a[i].value);
                                    }
                                    return {value, done: false};
                                }
                            );
                        }
                        return Promise.resolve({value: undefined, done: true});
                    },
                }
            );
        },
    });
}
