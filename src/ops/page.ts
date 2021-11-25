import {Piper} from '../types';

/**
 * Splits values into pages of specified size.
 */
export function page<T>(size: number): Piper<T, T[]> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T[]> {
            const i = iterable[Symbol.iterator]();
            let done = false, start = true;
            return {
                next(): IteratorResult<T[]> {
                    if (!done) {
                        if (start) {
                            if (typeof size !== 'number' || size < 1) {
                                throw new TypeError(`Page size must be a number, greater than zero: ${JSON.stringify(size)}`);
                            }
                            start = false;
                        }
                        const value = [];
                        let a, c = 0;
                        while (c++ < size && !(a = i.next()).done) {
                            value.push(a.value);
                            done = !!a.done;
                        }
                        if (value.length) {
                            return {value};
                        }
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
