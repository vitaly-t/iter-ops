import {Any, Piper} from '../types';

/**
 * Adds default value|iterator|iterable to an empty iterable.
 */
export function defaultEmpty<T>(value: T): Piper<T, T>;
export function defaultEmpty<T>(value: Iterator<T>): Piper<T, T>;
export function defaultEmpty<T>(value: Iterable<T>): Piper<T, T>;

export function defaultEmpty<T>(value: Any<T>): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = -1, k: Iterator<T>, v: any, start = true;
            return {
                next(): IteratorResult<T> {
                    if (index < 0) {
                        const a = i.next();
                        if (!a.done) {
                            return a;
                        }
                        index = 0;
                    }
                    while (index < values.length) {
                        if (start) {
                            v = values[index];
                            k = v?.next ? v : v?.[Symbol.iterator]?.();
                            start = false;
                        }
                        if (k) {
                            const b = k.next();
                            if (!b.done) {
                                return b;
                            }
                        }
                        start = true;
                        index++;
                        if (!k) {
                            return {value: v};
                        }
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
