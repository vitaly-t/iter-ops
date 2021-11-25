import {Piper} from '../types';

/**
 * Splits values into pages of specified size.
 */
export function page<T>(size: number): Piper<T, T[]> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T[]> {
            const i = iterable[Symbol.iterator]();
            return {
                next(): IteratorResult<T[]> {
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
