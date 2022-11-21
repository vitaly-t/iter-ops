import {
    isAsyncIterable,
    isSyncIterable,
    isUnknownIterator,
    isIteratorResult,
    isObject,
    isPromiseLike,
    isIndexed,
} from './typeguards';
import {$A, $S, UnknownIterable} from './types';
import {indexedAsyncIterable} from './utils';

/**
 * Converts any synchronous iterable into asynchronous one.
 *
 * It makes possible to use asynchronous-only operators downstream,
 * while also correctly casting all types in the pipeline, avoiding
 * any ambiguity between synchronous and asynchronous iterables.
 *
 * ```ts
 * const i = pipe(
 *     toAsync(source), // make iterable asynchronous
 *     delay(500) // now can use asynchronous operators
 * );
 * ```
 *
 * - Passing it an already asynchronous iterable will just reuse it.
 * - All indexed types are optimized for performance.
 *
 * @throws `TypeError: 'Cannot convert to AsyncIterable'` when conversion is not possible.
 *
 * @see
 *  - {@link toIterable}
 *  - {@link pipe}
 * @category Core
 */
export function toAsync<T>(i: UnknownIterable<T>): AsyncIterable<T> {
    // Already an async iterable?
    if (isAsyncIterable<typeof i, T>(i)) {
        return i;
    }
    if (!isSyncIterable(i)) {
        throw new TypeError('Cannot convert to AsyncIterable');
    }
    if (isIndexed(i)) {
        return indexedAsyncIterable(i);
    }
    return {
        [$A](): AsyncIterator<T> {
            const it = i[$S]();
            return {
                next(): Promise<IteratorResult<T>> {
                    return Promise.resolve(it.next());
                },
            };
        },
    };
}

/**
 * Converts a synchronous `Iterator` into a synchronous `Iterable`, so it can be used as a pipeline source/input.
 *
 * Note that an iterator type can only be determined by starting the iteration, which is what this method does.
 * So if getting the first iterator value throws an error, it will occur outside the pipeline.
 *
 * Passing it an already iterable object will just reuse it.
 *
 * @see
 *  - {@link https://github.com/vitaly-t/iter-ops/wiki/Iterators Iterators}
 *  - {@link toAsync}
 *  - {@link pipe}
 * @category Core
 */
export function toIterable<T>(i: Iterator<T>): Iterable<T>;

/**
 * Converts an asynchronous `AsyncIterator` into asynchronous `AsyncIterable`, so it can be used as a pipeline source/input.
 *
 * Note that an iterator type can only be determined by starting the iteration, which is what this method does.
 * So if getting the first iterator value throws an error, it will occur outside the pipeline.
 *
 * Passing it an already iterable object will just reuse it.
 *
 * @see
 *  - {@link https://github.com/vitaly-t/iter-ops/wiki/Iterators Iterators}
 *  - {@link toAsync}
 *  - {@link pipe}
 * @category Core
 */
export function toIterable<T>(i: AsyncIterator<T>): AsyncIterable<T>;

/**
 * Synchronous type inference helper.
 *
 * @hidden
 */
export function toIterable<T>(i: {
    next: () => { value: T | undefined };
}): Iterable<T>;

/**
 * Asynchronous type inference helper.
 *
 * @hidden
 */
export function toIterable<T>(i: {
    next: () => PromiseLike<{ value: T | undefined }>;
}): AsyncIterable<T>;

/**
 * Converts a `Promise` into a one-value `AsyncIterable`, so it can be used as a pipeline source/input.
 *
 * ```ts
 * import {pipe, toIterable, spread} from 'iter-ops';
 *
 * const input = Promise.resolve([1, 2, 3, 4, 5]);
 *
 * const i = pipe(
 *     toIterable(input),
 *     spread()
 * ); // = AsyncIterableExt<number>
 *
 * for await(const a of i) {
 *     console.log(a); // 1, 2, 3, 4, 5
 * }
 * ```
 *
 * @see
 *  - {@link https://github.com/vitaly-t/iter-ops/wiki/Iterators Iterators}
 *  - {@link toAsync}
 *  - {@link pipe}
 * @category Core
 */
export function toIterable<T>(i: Promise<T>): AsyncIterable<T>;

/**
 * Converts a simple value into a one-value synchronous iterable, so it can be used as a pipeline source/input.
 *
 * @see
 *  - {@link https://github.com/vitaly-t/iter-ops/wiki/Iterators Iterators}
 *  - {@link toAsync}
 *  - {@link pipe}
 * @category Core
 */
export function toIterable<T>(i: T): Iterable<T>;

export function toIterable<T>(i: unknown) {
    if (isObject(i)) {
        // Already an iterable?
        if (isSyncIterable(i) || isAsyncIterable(i)) {
            return i;
        }

        // An iterator.
        if (isUnknownIterator<typeof i, T>(i)) {
            const value: unknown = i.next(); // this line may throw (outside the pipeline)
            if (isObject(value)) {
                const s = isPromiseLike(value) ? $A : $S;
                if (s === $A || isIteratorResult(value)) {
                    return {
                        [s]() {
                            let started: boolean;
                            return {
                                next() {
                                    if (started) {
                                        return i.next();
                                    }
                                    started = true;
                                    return value;
                                },
                            };
                        },
                    };
                }
            }
        }

        // An async value.
        if (isPromiseLike<typeof i, T>(i)) {
            return toSingleAsyncIterable(i);
        }
    }

    // A sync value.
    return toSyncIterable(i);
}

/**
 * Converts an indexed (array-like) value into a reversed iterable.
 *
 * This is to produce a maximum-performance reversed iterable, by wrapping data into
 * iterable and applying logical reversal (without any processing) at the same time.
 *
 * ```ts
 * import {reverse} from 'iter-ops';
 *
 * const i = reverse('word'); //=> Iterable<string>
 *
 * console.log([...i]); //=> ['d', 'r', 'o', 'w']
 * ```
 *
 * @throws `TypeError: 'An array-like value was expected: ...'` when the input is not array-like.
 *
 * @category Core
 */
export function reverse<T>(input: ArrayLike<T>): Iterable<T> {
    if (typeof input?.length !== 'number') {
        throw new TypeError(`An array-like value was expected: ${JSON.stringify(input)}`);
    }
    return {
        [$S](): Iterator<T> {
            let i = input.length;
            return {
                next(): IteratorResult<T> {
                    return i
                        ? {value: input[--i], done: false}
                        : {value: undefined, done: true};
                },
            };
        },
    };
}

/**
 * Create an iterable that has the given value as its only element.
 */
function toSyncIterable<T>(value: T): Iterable<T> {
    return [value];
}

/**
 * Create an async iterable that has the awaited given value as its only element.
 */
function toSingleAsyncIterable<T>(
    asyncValue: PromiseLike<T>
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            let finished: boolean;
            return {
                next(): Promise<IteratorResult<T>> {
                    if (finished) {
                        return Promise.resolve({
                            value: undefined,
                            done: true,
                        });
                    }
                    finished = true;
                    return (asyncValue as Promise<T>).then((value: T) => ({
                        value,
                        done: false,
                    }));
                },
            };
        },
    };
}
