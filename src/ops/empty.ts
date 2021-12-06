import {SyncPiper} from '../types';

/**
 * Produces an empty iterable.
 */
export function empty<T>(): SyncPiper<T, T> {
    return () => ({
        [Symbol.iterator]: () => ({next: () => ({value: undefined, done: true})})
    });
}
