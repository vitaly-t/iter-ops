import {Piper} from '../types';

/**
 * Accumulates all values from the iterable, into an array,
 * and returns a one-value iterable, to produce that array.
 */
export function toArray<T>(): Piper<T, T[]> {
    return (iterator: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T[]> {
            let done = false;
            return {
                next(): IteratorResult<T[]> {
                    let value;
                    if (done) {
                        return {value, done};
                    }
                    value = [];
                    for (const a of iterator) {
                        value.push(a);
                    }
                    done = true
                    return {value};
                }
            };
        }
    });
}
