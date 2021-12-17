import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Pair of `{index, value}` that passed predicate test of [[indexBy]] operator.
 */
export interface IIndexedValue<T> {
    /**
     * Index of the value that passed the predicate test.
     */
    index: number;

    /**
     * Value that corresponds to the `index`.
     */
    value: T;
}

/**
 * Emits indexed values that pass the predicate test.
 *
 * ```ts
 * const i = pipe(
 *     [12, 7, 30, 9],
 *     indexBy(a => a % 2 === 0) // index even numbers
 * );
 *
 * console.log([...i]); //=> [{index: 0, value: 12}, {index: 2, value: 30}]
 * ```
 *
 * @see [[IIndexedValue]]
 * @category Sync+Async
 */
export function indexBy<T>(cb: (value: T, index: number, state: IterationState) => boolean): Operation<T, IIndexedValue<T>> {
    return createOperation(indexBySync, indexByAsync, arguments);
}

function indexBySync<T>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): Iterable<IIndexedValue<T>> {
    return {
        [Symbol.iterator](): Iterator<IIndexedValue<T>> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = -1;
            return {
                next(): IteratorResult<IIndexedValue<T>> {
                    let a;
                    while (!(a = i.next()).done && !cb(a.value, ++index, state));
                    return a.done ? a : {value: {index, value: a.value}, done: false};
                }
            };
        }
    };
}

function indexByAsync<T, R>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): AsyncIterable<IIndexedValue<T>> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<IIndexedValue<T>> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let index = -1;
            return {
                next(): Promise<IteratorResult<IIndexedValue<T>>> {
                    return i.next().then(a => {
                        if (a.done) {
                            return a;
                        }
                        return cb(a.value, ++index, state) ? {
                            value: {index, value: a.value},
                            done: false
                        } : this.next();
                    });
                }
            };
        }
    };
}
