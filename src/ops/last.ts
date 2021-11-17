import {Piper} from '../types';

/**
 * Produces a one-value iterable, with the last emitted value.
 *
 * When optional predicate is provided, the last value satisfying it will be emitted.
 */
export function last<T>(cb?: (value: T, index: number) => boolean): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const test = typeof cb === 'function' && cb;
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    let a, r;
                    while (!(a = i.next()).done) {
                        if (!test || test(a.value, index++)) {
                            r = a;
                        }
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
