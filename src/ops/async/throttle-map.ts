import {IterationState, Operation} from '../../types';
import {createOperation, throwOnSync} from '../../utils';

/**
 * Emits each value after the callback result resolves.
 * The resolved value itself is ignored.
 */
export function throttleMap<T, R>(cb: (value: T, index: number, state: IterationState) => Promise<R>): Operation<T, R> {
    return createOperation(throwOnSync('throttleMap'), throttleMapAsync, arguments);
}

function throttleMapAsync<T, R>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => Promise<R>): AsyncIterable<R> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<R> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<R>> {
                    return i.next().then(a => a.done ? a : cb(a.value, index++, state).then(value => ({
                        value,
                        done: false
                    })));
                }
            };
        }
    };
}
