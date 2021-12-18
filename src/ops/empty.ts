import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Emits an empty iterable, without pulling any values from the source,
 * i.e. it simply replaces the source iterable with an empty one.
 *
 * The operator doesn't change type of the previous iterable.
 *
 * @see [[drain]], [[isEmpty]], [[defaultEmpty]]
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
