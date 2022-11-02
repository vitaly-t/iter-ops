import {$A, Operation} from '../../types';
import {isPromiseLike} from '../../typeguards';
import {createOperation, throwOnSync} from '../../utils';

/**
 * @category Async-only
 */
export function waitCache<T>(n: number): Operation<Promise<T> | T, T>;

export function waitCache() {
    return createOperation(throwOnSync('waitCache'), waitCacheAsync);
}

export function waitCacheAsync<T>(
    iterable: AsyncIterable<Promise<T> | T>,
    n: number
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const cache: Promise<any>[] = [];
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (a.done) {
                            return a as any;
                        }
                        const p = a.value as Promise<T>;
                        if (isPromiseLike(p)) {
                            cache.push(p);
                            if (cache.length === n) {
                                // maximum cache size reached;
                                return Promise.race(cache).then(data => {
                                    // cache.splice(...); // Need to remove one that's resolved, somehow
                                    return data;
                                });
                            }
                        }
                        return a;
                    });
                },
            };
        },
    };
}
