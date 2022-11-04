import {$A, Operation} from '../../types';
import {isPromiseLike} from '../../typeguards';
import {createOperation, throwOnSync} from '../../utils';

/**
 * Caches up every N promises, to race-resolve them and emit unordered results.
 *
 * It improves performance when handling multiple lengthy asynchronous operations,
 * by letting you process results in the order in which they resolve, rather than
 * the order in which those operations are created.
 *
 * ```ts
 * import {pipeAsync, map, waitRace} from 'iter-ops';
 *
 * const i = pipeAsync(
 *              [1, 2, 3, 4, 5],
 *              map(a => Promise.resolve(a * 10)), // replace with async processing
 *              waitRace(3) // cache & wait for up to 3 values at a time
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
 * import {pipeAsync, map, waitRace} from 'iter-ops';
 *
 * const i = pipeAsync(
 *              [1, 2, 3],
 *              map(s => Promise.resolve(s * 10).then(r => ({s, r}))), // {source, resolution}
 *              waitRace(2)
 *              );
 *
 * for await (const a of i) {
 *     console.log(a); //=> {s: 1, r: 10}, {s: 3, r: 30}, {s: 2, r: 20} (unordered race-resolution)
 * }
 * ```
 *
 * @param cacheSize
 * Maximum number of promises to be cached up for concurrent resolution racing.
 *
 * @see
 *  - {@link wait}
 *
 * @category Async-only
 */
export function waitRace<T>(cacheSize: number): Operation<Promise<T> | T, T>;

export function waitRace(...args: unknown[]) {
    return createOperation(throwOnSync('waitRace'), waitRaceAsync, args);
}

export function waitRaceAsync<T>(
    iterable: AsyncIterable<Promise<T> | T>,
    cacheSize: number
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            cacheSize = cacheSize > 1 ? cacheSize : 1; // cache size cannot be smaller than 1
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
                            if (cache.size + settled.length < cacheSize) {
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
