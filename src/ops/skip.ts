import {SyncPiper} from '../types';

/**
 * Starts emitting values after "count" number of values.
 */
export function skip<T>(count: number): SyncPiper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0, done = false;
            return {
                next(): IteratorResult<T> {
                    let a = i.next();
                    if (!done) {
                        while (!a.done && index++ < count) {
                            a = i.next();
                        }
                        done = true;
                    }
                    return a;
                }
            };
        }
    });
}
