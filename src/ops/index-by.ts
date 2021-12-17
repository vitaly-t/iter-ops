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
 * @category Sync+Async
 */
export function indexBy<T>(cb: (value: T, index: number, state: IterationState) => boolean): Operation<T, IIndexedValue<T>> {
    return createOperation(indexBySync, indexByAsync, arguments);
}

function indexBySync<T>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): Iterable<IIndexedValue<T>> {
    return {
        [Symbol.iterator](): Iterator<IIndexedValue<T>> {
            // const i = iterable[Symbol.iterator]();
            // const state: IterationState = {};
            // let index = 0;
            return {
                next(): IteratorResult<IIndexedValue<T>> {
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function indexByAsync<T, R>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): AsyncIterable<IIndexedValue<T>> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<IIndexedValue<T>> {
            const i = iterable[Symbol.asyncIterator]();
            // const state: IterationState = {};
            // let index = 0;
            return {
                next(): Promise<IteratorResult<IIndexedValue<T>>> {
                    return i.next() as any;
                }
            };
        }
    };
}
