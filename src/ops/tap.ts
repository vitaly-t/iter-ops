import {Piper} from '../types';

/**
 * Taps into each value, without changing the output.
 */
export function tap<T>(cb: (value: T, index: number) => void): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    const a = i.next();
                    if (!a.done) {
                        cb(a.value, index++);
                    }
                    return a;
                }
            };
        }
    });
}
