import {Piper} from '../types';

/**
 * Produces a one-value iterable, with the last emitted value.
 */
export function last<T>(): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            return {
                next(): IteratorResult<T> {
                    let a, r;
                    while (!(a = i.next()).done) {
                        r = a;
                    }
                    if (r) {
                        return {value: r.value};
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
