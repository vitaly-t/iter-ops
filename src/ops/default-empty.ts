import {isPromiseLike} from '../typeguards';
import {
    $A,
    $S,
    AsyncOperation,
    DuelOperation,
    SyncOperation,
    SyncValue,
    Value,
} from '../types';

import {createDuelOperation} from '../utils';

/**
 * Adds a default value, iterator or iterable to an empty pipeline.
 *
 * If the pipeline has at least one value, the defaults are ignored.
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
export function defaultEmpty<T, D>(value: Value<D>): DuelOperation<T, T | D> {
    return createDuelOperation<T, D>(defaultEmptySync, defaultEmptyAsync, [
        value,
    ]);
}

/**
 * Adds a default value, iterator or iterable to an empty pipeline.
 *
 * If the pipeline has at least one value, the defaults are ignored.
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
 * @see
 *  - {@link empty}
 *  - {@link isEmpty}
 * @category Operations
 */
export function defaultEmptySync<T, D>(
    value: SyncValue<D>
): SyncOperation<T, T | D> {
    return (iterable) => ({
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
    });
}

/**
 * Adds a default value, iterator or iterable to an empty pipeline.
 *
 * If the pipeline has at least one value, the defaults are ignored.
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
 * @see
 *  - {@link empty}
 *  - {@link isEmpty}
 * @category Operations
 */

export function defaultEmptyAsync<T, D>(
    value: Value<D>
): AsyncOperation<T, T | D> {
    return (iterable) => ({
        [$A](): AsyncIterator<T | D> {
            const i = iterable[$A]();
            let k: AsyncIterator<T>,
                started = false, // set once default iteration started
                done = false, // set when we are finished (with a simple value)
                skip = false; // set when default data not needed
            return {
                next(): Promise<IteratorResult<T | D>> {
                    if (skip) {
                        return i.next();
                    }
                    if (done) {
                        return Promise.resolve({value: undefined, done});
                    }
                    if (started) {
                        if (k) {
                            const b = k.next();
                            return isPromiseLike(b) ? b : Promise.resolve(b);
                        }
                        done = true; // we are done with our simple value;
                        return Promise.resolve({
                            value: value as any,
                            done: false,
                        });
                    }
                    return i.next().then((a) => {
                        if (a.done) {
                            const x = value as any;
                            k =
                                typeof x?.next === 'function'
                                    ? x
                                    : x?.[$S]?.() ?? x?.[$A]?.();
                            started = true;
                            return this.next();
                        }
                        skip = true;
                        return a;
                    });
                },
            };
        },
    });
}
