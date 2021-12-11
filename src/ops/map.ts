import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Standard map logic for the iterable, extended for supporting iteration state.
 *
 * @see [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
 *
 * @category Sync+Async
 */
export function map<T, R>(cb: (value: T, index: number, state: IterationState) => R): Operation<T, R> {
    return createOperation(mapSync, mapAsync, arguments);
}

function mapSync<T, R>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => R): Iterable<R> {
    return {
        [Symbol.iterator](): Iterator<R> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): IteratorResult<R> {
                    let a;
                    while (!(a = i.next()).done) {
                        return {value: cb(a.value, index++, state), done: false};
                    }
                    return a;
                }
            };
        }
    };
}

function mapAsync<T, R>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => R): AsyncIterable<R> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<R> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<R>> {
                    return i.next().then(a => a.done ? a : {value: cb(a.value, index++, state), done: false});
                }
            };
        }
    };
}
