import {Any, Piper} from '../types';

/**
 * Adds default value|iterator|iterable to an empty iterable.
 */
export function defaultEmpty<T, D>(value: Iterable<D>): Piper<T, T | D>;
export function defaultEmpty<T, D>(value: Iterator<D>): Piper<T, T | D>;
export function defaultEmpty<T, D>(value: D): Piper<T, T | D>;

export function defaultEmpty<T, D>(value: Any<D>): Piper<T, T | D> {
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
