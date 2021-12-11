import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Standard filter logic for the iterable, extended for supporting iteration state.
 *
 * @see [Array.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
 *
 * @category Sync+Async
 */
export function filter<T>(cb: (value: T, index: number, state: IterationState) => boolean): Operation<T, T> {
    return createOperation(filterSync, filterAsync, arguments);
}

function filterSync<T>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    let a;
                    while (!(a = i.next()).done && !cb(a.value, index++, state));
                    return a;
                }
            };
        }
    };
}

function filterAsync<T>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => a.done ? a : (cb(a.value, index++, state) ? a : this.next()));
                }
            };
        }
    };
}
