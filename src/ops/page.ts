import {Piper} from '../types';

/**
 * Splits values into pages of fixed size (last page can be smaller).
 *
 * Throws an error when page size is less than 1 or not a number.
 */
export function page<T>(size: number): Piper<T, T[]> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T[]> {
            const i = iterable[Symbol.iterator]();
            let start = true;
            return {
                next(): IteratorResult<T[]> {
                    if (start) {
                        if (typeof size !== 'number' || size < 1) {
                            throw new TypeError(`Page size >= 1 is required: ${JSON.stringify(size)}`);
                        }
                        start = false;
                    }
                    const value = [];
                    let a, c = 0;
                    while (c++ < size && !(a = i.next()).done) {
                        value.push(a.value);
                    }
                    if (value.length) {
                        return {value};
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
