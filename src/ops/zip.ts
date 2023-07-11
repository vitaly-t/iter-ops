import {
    UnknownIterable,
    UnknownIterator,
    UnknownIterableOrIterator,
    Operation,
    $S,
    $A,
} from '../types';
import {createOperation, iterateOnce} from '../utils';

/** @hidden */
export function zip<T>(): Operation<T, [T]>;

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
 * @category Sync+Async
 */
export function zip<T, A>(
    v0: UnknownIterableOrIterator<A>,
): Operation<T, [T, A]>;
/** @hidden */
export function zip<T, A, B>(
    v0: UnknownIterableOrIterator<A>,
    v1: UnknownIterableOrIterator<B>,
): Operation<T, [T, A, B]>;
/** @hidden */
export function zip<T, A, B, C>(
    v0: UnknownIterableOrIterator<A>,
    v1: UnknownIterableOrIterator<B>,
    v2: UnknownIterableOrIterator<C>,
): Operation<T, [T, A, B, C]>;
/** @hidden */
export function zip<T, A, B, C, D>(
    v0: UnknownIterableOrIterator<A>,
    v1: UnknownIterableOrIterator<B>,
    v2: UnknownIterableOrIterator<C>,
    v3: UnknownIterableOrIterator<D>,
): Operation<T, [T, A, B, C, D]>;
/** @hidden */
export function zip<T, A, B, C, D, E>(
    v0: UnknownIterableOrIterator<A>,
    v1: UnknownIterableOrIterator<B>,
    v2: UnknownIterableOrIterator<C>,
    v3: UnknownIterableOrIterator<D>,
    v4: UnknownIterableOrIterator<E>,
): Operation<T, [T, A, B, C, D, E]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F>(
    v0: UnknownIterableOrIterator<A>,
    v1: UnknownIterableOrIterator<B>,
    v2: UnknownIterableOrIterator<C>,
    v3: UnknownIterableOrIterator<D>,
    v4: UnknownIterableOrIterator<E>,
    v5: UnknownIterableOrIterator<F>,
): Operation<T, [T, A, B, C, D, E, F]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G>(
    v0: UnknownIterableOrIterator<A>,
    v1: UnknownIterableOrIterator<B>,
    v2: UnknownIterableOrIterator<C>,
    v3: UnknownIterableOrIterator<D>,
    v4: UnknownIterableOrIterator<E>,
    v5: UnknownIterableOrIterator<F>,
    v6: UnknownIterableOrIterator<G>,
): Operation<T, [T, A, B, C, D, E, F, G]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G, H>(
    v0: UnknownIterableOrIterator<A>,
    v1: UnknownIterableOrIterator<B>,
    v2: UnknownIterableOrIterator<C>,
    v3: UnknownIterableOrIterator<D>,
    v4: UnknownIterableOrIterator<E>,
    v5: UnknownIterableOrIterator<F>,
    v6: UnknownIterableOrIterator<G>,
    v7: UnknownIterableOrIterator<H>,
): Operation<T, [T, A, B, C, D, E, F, G, H]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G, H, I>(
    v0: UnknownIterableOrIterator<A>,
    v1: UnknownIterableOrIterator<B>,
    v2: UnknownIterableOrIterator<C>,
    v3: UnknownIterableOrIterator<D>,
    v4: UnknownIterableOrIterator<E>,
    v5: UnknownIterableOrIterator<F>,
    v6: UnknownIterableOrIterator<G>,
    v7: UnknownIterableOrIterator<H>,
    v8: UnknownIterableOrIterator<I>,
): Operation<T, [T, A, B, C, D, E, F, G, H, I]>;
/** @hidden */
export function zip<T, A, B, C, D, E, F, G, H, I, J>(
    v0: UnknownIterableOrIterator<A>,
    v1: UnknownIterableOrIterator<B>,
    v2: UnknownIterableOrIterator<C>,
    v3: UnknownIterableOrIterator<D>,
    v4: UnknownIterableOrIterator<E>,
    v5: UnknownIterableOrIterator<F>,
    v6: UnknownIterableOrIterator<G>,
    v7: UnknownIterableOrIterator<H>,
    v8: UnknownIterableOrIterator<I>,
    v9: UnknownIterableOrIterator<J>,
): Operation<T, [T, A, B, C, D, E, F, G, H, I, J]>;

export function zip(...args: unknown[]) {
    return createOperation(zipSync, zipAsync, args);
}

function zipSync<T>(
    iterable: Iterable<T>,
    ...values: (Iterator<T> | Iterable<T>)[]
): Iterable<Array<any>> {
    return {
        [$S](): Iterator<Array<any>> {
            const list: Iterator<any>[] = [
                iterable[$S](),
                ...values.map((v: any) =>
                    typeof v[$S] === 'function' ? v[$S]() : v,
                ),
            ];
            const errIterator = validateZipIterators(true, list);
            let finished: boolean;
            return (
                errIterator || {
                    next(): IteratorResult<Array<any>> {
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
    };
}

function zipAsync<T>(
    iterable: AsyncIterable<T>,
    ...values: UnknownIterable<T>[]
): AsyncIterable<Array<any>> {
    return {
        [$A](): AsyncIterator<Array<T>> {
            const list: UnknownIterator<any>[] = [
                iterable[$A](),
                ...values.map((v: any) =>
                    typeof v[$S] === 'function'
                        ? v[$S]()
                        : typeof v[$A] === 'function'
                        ? v[$A]()
                        : v,
                ),
            ];
            const errIterator = validateZipIterators(false, list);
            let finished: boolean;
            return (
                errIterator || {
                    next(): Promise<IteratorResult<Array<any>>> {
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
                                },
                            );
                        }
                        return Promise.resolve({value: undefined, done: true});
                    },
                }
            );
        },
    };
}

function validateZipIterators<T>(sync: boolean, inputs: UnknownIterator<T>[]) {
    for (let i = 1; i < inputs.length; i++) {
        const a = inputs[i];
        if (!a || typeof a.next !== 'function') {
            return iterateOnce(sync, () => {
                // either not iterable, or async iterable passed inside synchronous pipeline;
                throw new TypeError(
                    `Value at index ${i - 1} is not iterable: ${JSON.stringify(
                        a,
                    )}`,
                );
            }) as any;
        }
    }
}
