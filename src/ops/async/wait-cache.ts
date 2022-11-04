import {$A, Operation} from '../../types';
import {isPromiseLike} from '../../typeguards';
import {createOperation, throwOnSync} from '../../utils';

/**
 * Caches up to N promises, for concurrent resolution, and emits unordered results,
 * based on promise race-resolution.
 *
 * It improves performance when handling multiple lengthy asynchronous operations,
 * by letting you process results in the order in which they resolve, rather than
 * the order in which those operations are created.
 *
 * ```ts
 * import {pipeAsync, map, waitCache} from 'iter-ops';
 *
 * const i = pipeAsync(
 *              [1, 2, 3, 4, 5],
 *              map(a => Promise.resolve(a * 10)), // replace with async processing
 *              waitCache(3) // cache & wait for up to 3 values at a time
 *              );
 *
 * for await (const a of i) {
 *     console.log(a); //=> 10, 40, 20, 50, 30 (unordered race-resolution)
 * }
 * ```
 *
 * This operator can handle a combination of promises and simple values, with the latter
 * emitted immediately, as they appear.
 *
 * When results need to be linked to the source, you can simply remap the operations,
 * like shown in the following example:
 *
 * ```ts
 * import {pipeAsync, map, waitCache} from 'iter-ops';
 *
 * const i = pipeAsync(
 *              [1, 2, 3],
 *              map(s => Promise.resolve(s * 10).then(r => ({s, r}))), // {source, resolution}
 *              waitCache(2)
 *              );
 *
 * for await (const a of i) {
 *     console.log(a); //=> {s: 1, r: 10}, {s: 3, r: 30}, {s: 2, r: 20} (unordered race-resolution)
 * }
 * ```
 *
 * @see
 *  - {@link wait}
 *
 * @category Async-only
 */
export function waitCache<T>(n: number): Operation<Promise<T> | T, T>;

export function waitCache(...args: unknown[]) {
    return createOperation(throwOnSync('waitCache'), waitCacheAsync, args);
}

export function waitCacheAsync<T>(
    iterable: AsyncIterable<Promise<T> | T>,
    n: number
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            n = n > 1 ? n : 1; // cache size cannot be smaller than 1
            const i = iterable[$A]();
            const cache = new Map<number, Promise<void>>();
            let index = 0;
            let finished = false;
            const settled: Promise<IteratorResult<T>>[] = [];
            const resolveCache = (): Promise<IteratorResult<T>> => {
                if (settled.length) {
                    return settled.shift() as Promise<IteratorResult<T>>;
                }
                if (cache.size) {
                    return Promise.race(cache.values()).then(resolveCache);
                }
                return Promise.resolve({value: undefined, done: true});
            };
            return {
                next(): Promise<IteratorResult<T>> {
                    if (finished) {
                        return resolveCache();
                    }
                    return i.next().then((a) => {
                        if (a.done) {
                            finished = true;
                            return resolveCache();
                        }
                        const p = a.value as Promise<T>;
                        if (isPromiseLike(p)) {
                            const key = index++;
                            const v = p
                                .then((value: T) => {
                                    settled.push(
                                        Promise.resolve({value, done: false})
                                    );
                                })
                                .catch((err) => {
                                    settled.push(Promise.reject(err));
                                })
                                .finally(() => cache.delete(key));
                            cache.set(key, v);
                            if (cache.size + settled.length < n) {
                                return this.next(); // continue accumulation
                            }
                            return resolveCache();
                        }
                        return a as IteratorResult<T>; // non-promise values are returned immediately
                    });
                },
            };
        },
    };
}
