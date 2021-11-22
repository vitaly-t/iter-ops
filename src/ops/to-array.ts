import {Piper} from '../types';

/**
 * Accumulates all values from the iterable, into an array,
 * and returns a one-value iterable, to emit that array.
 */
export function toArray<T>(): Piper<T, T[]> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T[]> {
            const i = iterable[Symbol.iterator]();
            let done = false;
            return {
                next(): IteratorResult<T[]> {
                    if (done) {
                        return {value: undefined, done};
                    }
                    const arr = [];
                    let a;
                    while (!(a = i.next()).done) {
                        arr.push(a.value);
                    }
                    done = true;
                    return {value: arr};
                }
            };
        }
    });
}
