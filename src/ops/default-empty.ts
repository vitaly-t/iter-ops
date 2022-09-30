import {
    Value,
    SyncValue,
    UnknownIterable,
    UnknownIterator,
    Operation,
    $S,
    $A,
} from '../types';
import {createOperation} from '../utils';

/**
 * Adds a default iterable to an empty pipeline.
 *
 * ```ts
 * import {pipe, defaultEmpty} from 'iter-ops';
 *
 * const i = pipe(
 *     [], // empty iterable/pipeline
 *     defaultEmpty([1, 2, 3]) // default for an empty pipeline
 * );
 *
 * console.log(...i); //=> 1, 2, 3
 * ```
 *
 * Note that if you add asynchronous defaults into a synchronous pipeline, they will be processed as simple values.
 *
 * @see
 *  - {@link empty}
 *  - {@link isEmpty}
 * @category Sync+Async
 */
export function defaultEmpty<T, D>(
    iterable: UnknownIterable<D>
): Operation<T, T | D>;

/**
 * Adds a default iterator to an empty pipeline.
 *
 * @see
 *  - {@link empty}
 *  - {@link isEmpty}
 * @category Sync+Async
 */
export function defaultEmpty<T, D>(
    iterator: UnknownIterator<D>
): Operation<T, T | D>;

/**
 * Adds a default value to an empty pipeline.
 *
 * @see
 *  - {@link empty}
 *  - {@link isEmpty}
 * @category Sync+Async
 */
export function defaultEmpty<T, D>(value: D): Operation<T, T | D>;

export function defaultEmpty(...args: unknown[]) {
    return createOperation(defaultEmptySync, defaultEmptyAsync, args);
}

function defaultEmptySync<T, D>(
    iterable: Iterable<T>,
    value: SyncValue<D>
): Iterable<T | D> {
    return {
        [$S](): Iterator<T | D> {
            const i = iterable[$S]();
            let k: Iterator<T>,
                v: any,
                start = true,
                empty = true,
                done = false;
            return {
                next(): IteratorResult<T> {
                    if (!done) {
                        const a = i.next();
                        if (!a.done) {
                            empty = false;
                            return a;
                        }
                        if (empty) {
                            if (start) {
                                v = value;
                                k =
                                    typeof v?.next === 'function'
                                        ? v
                                        : v?.[$S]?.();
                                start = false;
                            }
                            if (k) {
                                const b = k.next();
                                done = !!b.done;
                                return b;
                            }
                            done = true;
                            return {value: v, done: false};
                        }
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    };
}

function defaultEmptyAsync<T, D>(
    iterable: AsyncIterable<T>,
    value: Value<D>
): AsyncIterable<T | D> {
    return {
        [$A](): AsyncIterator<T | D> {
            const i = iterable[$A]();
            let k: AsyncIterator<T>,
                v: any,
                start = true,
                empty = true,
                done = false;
            return {
                async next(): Promise<IteratorResult<T>> {
                    if (!done) {
                        const a = await i.next();
                        if (!a.done) {
                            empty = false;
                            return a;
                        }
                        if (empty) {
                            if (start) {
                                v = value;
                                k =
                                    typeof v?.next === 'function'
                                        ? v
                                        : v?.[$S]?.() || v?.[$A]?.();
                                start = false;
                            }
                            if (k) {
                                const b = await k.next();
                                done = !!b.done;
                                return b;
                            }
                            done = true;
                            return {value: v, done: false};
                        }
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    };
}
