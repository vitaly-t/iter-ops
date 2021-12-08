import {IterationState, Operation} from '../../types';
import {createOperation, throwOnSync} from '../../utils';

/**
 * Emits each value after the callback result resolves or emits a value.
 * The resolved/emitted value itself is ignored.
 */
export function throttle<T>(cb: (value: T, index: number, state: IterationState) => AsyncIterable<any> | Promise<any>): Operation<T, T> {
    return createOperation(throwOnSync('throttle'), throttleAsync, arguments);
}

function throttleAsync<T>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => AsyncIterable<T> | Promise<T>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            // const state: IterationState = {};
            // let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next(); // TODO: to be implemented
                }
            };
        }
    };
}
