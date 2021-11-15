import {Piper} from '../types';

/**
 * Logically merges current iterable with same-type list of values or iterables.
 * Merged values are iterated over after the current iterable is depleted.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
 */
export function concat<T>(...values: (T | Iterable<T>)[]): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            return {
                next(): IteratorResult<T> {
                    // TODO: to be implemented
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
