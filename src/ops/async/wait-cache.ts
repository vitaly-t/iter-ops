import {$A, Operation} from '../../types';
import {isPromiseLike} from '../../typeguards';
import {createOperation, throwOnSync} from '../../utils';

/**
 * **Experimental Feature**
 *
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
 *              map(a => Promise.resolve(a)), // replace with async processing
 *              waitCache(3) // cache & wait for up to 3 values at a time
 *              );
 *
 * for await (const a of i) {
 *     console.log(a); //=> 1, 4, 2, 5, 3 (unordered race-resolution)
 * }
 * ```
 *
 * This operator can handle a combination of promises and simple values, with the latter
 * emitted immediately, as they appear.
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
            const i = iterable[$A]();
            const cache = new Map<number, Promise<{key: number; value: T}>>();
            let index = 0;
            let finished = false;
            n = n > 1 ? n : 1; // cache size cannot be smaller than 1
            const resolveCache = (): Promise<IteratorResult<T>> => {
                if (cache.size) {
                    return Promise.race([...cache.values()]).then((a) => {
                        cache.delete(a.key);
                        return {value: a.value, done: false};
                    });
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
                            const v = p.then((value) => ({key, value}));
                            cache.set(key, v);
                            if (cache.size < n) {
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
