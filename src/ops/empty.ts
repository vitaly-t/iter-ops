import {$A, $S, type Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Emits an empty iterable, without pulling any values from the source,
 * i.e. it simply replaces the source iterable with an empty one.
 *
 * The operator doesn't change type of the previous iterable.
 *
 * @see
 *  - {@link drain}
 *  - {@link isEmpty}
 *  - {@link defaultEmpty}
 * @category Sync+Async
 */
export function empty<T>(): Operation<T, T>;

export function empty(...args: unknown[]) {
    return createOperation(emptySync, emptyAsync, args);
}

function emptySync<T>(): Iterable<T> {
    return {
        [$S]: () => ({next: () => ({value: undefined, done: true})})
    };
}

function emptyAsync<T>(): AsyncIterable<T> {
    return {
        [$A]: () => ({
            next() {
                return Promise.resolve({value: undefined, done: true});
            }
        })
    };
}
