import {Any, SyncPiper} from '../types';

/**
 * Adds default value|iterator|iterable to an empty iterable.
 */
export function defaultEmpty<T, D>(value: Iterable<D>): SyncPiper<T, T | D>;
export function defaultEmpty<T, D>(value: Iterator<D>): SyncPiper<T, T | D>;
export function defaultEmpty<T, D>(value: D): SyncPiper<T, T | D>;

export function defaultEmpty<T, D>(value: Any<D>): SyncPiper<T, T | D> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let k: Iterator<T>, v: any, start = true, empty = true, done = false;
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
                                k = typeof v?.next === 'function' ? v : v?.[Symbol.iterator]?.();
                                start = false;
                            }
                            if (k) {
                                const b = k.next();
                                done = !!b.done;
                                return b;
                            }
                            done = true;
                            return {value: v};
                        }
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
