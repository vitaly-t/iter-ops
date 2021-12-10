import {IterationState, Operation} from '../../types';
import {createOperation, throwOnSync} from '../../utils';

/**
 * Emits each value after the callback result resolves. The resolved value itself is ignored.
 *
 * Throws an error during iteration, if inside a synchronous pipeline.
 */
export function throttle<T>(cb: (value: T, index: number, state: IterationState) => Promise<any>): Operation<T, T> {
    return createOperation(throwOnSync('throttle'), throttleAsync, arguments);
}

function throttleAsync<T>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => Promise<any>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => a.done ? a : cb(a.value, index++, state).then(() => a));
                }
            };
        }
    };
}
