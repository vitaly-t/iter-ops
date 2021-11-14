import {Piper} from './common';

/**
 * Taps into each value, without changing the output.
 */
export function tap<T>(cb: (value: T, index: number) => void): Piper<T, T> {
    return (iterator: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            let index = 0, t = iterator[Symbol.iterator]();
            return {
                next(): IteratorResult<T> {
                    const a = t.next();
                    if (!a.done) {
                        cb(a.value, index++);
                    }
                    return a;
                }
            };
        }
    });
}
