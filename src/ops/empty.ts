import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Produces an empty iterable.
 *
 * @see [[isEmpty]], [[defaultEmpty]]
 * @category Sync+Async
 */
export function empty<T>(): Operation<T, T> {
    return createOperation(emptySync, emptyAsync);
}

function emptySync<T>(): Iterable<T> {
    return {
        [Symbol.iterator]: () => ({next: () => ({value: undefined, done: true})})
    };
}

function emptyAsync<T>(): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator]: () => ({
            next() {
                return Promise.resolve({value: undefined, done: true});
            }
        })
    };
}
