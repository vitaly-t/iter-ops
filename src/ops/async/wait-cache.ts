import {$A, Operation} from '../../types';
import {isPromiseLike} from '../../typeguards';
import {createOperation, throwOnSync} from '../../utils';

/**
 * Caches up to N promises, for concurrent resolution, and emits unordered results.
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
            const nextValue = (): Promise<IteratorResult<T>> => {
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
                        return nextValue();
                    }
                    return i.next().then((a) => {
                        if (a.done) {
                            finished = true;
                            return nextValue();
                        }
                        const p = a.value as Promise<T>;
                        if (isPromiseLike(p)) {
                            const key = index++;
                            const v = p.then((value) => ({key, value}));
                            cache.set(key, v);
                            if (cache.size < n) {
                                return this.next();
                            }
                            return nextValue();
                        }
                        return a as IteratorResult<T>;
                    });
                },
            };
        },
    };
}
