import {Piper} from '../types';

/**
 * Spreads iterable values.
 */
export function spread<T>(): Piper<Iterable<T>, T> {
    return (iterable: Iterable<Iterable<T>>) => ({
        [Symbol.iterator](): Iterator<T> {
            return {
                next(): IteratorResult<T> {
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
