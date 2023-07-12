import {
    Value,
    SyncValue,
    UnknownIterable,
    UnknownIterator,
    Operation,
    $S,
    $A
} from '../types';
import {createOperation} from '../utils';
import {isPromiseLike} from '../typeguards';

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
export function defaultEmpty<T, D>(
    iterable: UnknownIterable<D>
): Operation<T, T | D>;

/**
 * Adds a default value, iterator or iterable to an empty pipeline.
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
 * Adds a default value, iterator or iterable to an empty pipeline.
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
                }
            };
        }
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
                            done: false
                        });
                    }
                    return i.next().then((a) => {
                        if (a.done) {
                            const x = value as any;
                            k =
                                typeof x?.next === 'function'
                                    ? x
                                    : x?.[$S]?.() || x?.[$A]?.();
                            started = true;
                            return this.next();
                        }
                        skip = true;
                        return a;
                    });
                }
            };
        }
    };
}
