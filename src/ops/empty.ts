import {Piper} from '../types';

/**
 * Produces an empty iterable.
 */
export function empty<T>(): Piper<T, T> {
    return () => ({
        [Symbol.iterator]: () => ({next: () => ({value: undefined, done: true})})
    });
}
