import {IterationState, Operation} from '../../types';
import {createOperation, throwOnSync} from '../../utils';

/**
 * Delays each value by the specified timeout.
 * When the timeout is a negative number, it is not added.
 *
 * Throws an error during iteration, if inside a synchronous pipeline.
 *
 * @category Async-only
 */
export function delay<T>(timeout: number): Operation<T, T>;

/**
 * Delays each value by the specified timeout (as returned from the callback).
 * When the timeout is a negative number, it is not added.
 *
 * Note that it doesn't support return of Promise<number> on purpose, to avoid
 * confusion with what operator `throttle` does.
 *
 * Throws an error during iteration, if inside a synchronous pipeline.
 *
 * @category Async-only
 */
export function delay<T>(cb: (value: T, index: number, state: IterationState) => number): Operation<T, T>;

export function delay<T>(timeout: number | ((value: T, index: number, state: IterationState) => number)): Operation<T, T> {
    return createOperation(throwOnSync('delay'), delayAsync, arguments);
}

function delayAsync<T>(iterable: AsyncIterable<T>, timeout: number | ((value: T, index: number, state: IterationState) => number)): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const cb = typeof timeout === 'function' && timeout;
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => {
                        if (a.done) {
                            return a;
                        }
                        const delay: number = cb ? cb(a.value, index++, state) : timeout;
                        return delay < 0 ? a : new Promise(resolve => setTimeout(() => resolve(a), delay));
                    });
                }
            };
        }
    };
}
