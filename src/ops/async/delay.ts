import {IterationState, Operation} from '../../types';
import {createOperation, throwOnSync} from '../../utils';

/**
 * Delays next value by the specified timeout (direct number or from a callback).
 * When the delay is a negative number, no timeout added.
 *
 * Throws error during iteration, if inside a synchronous pipeline.
 */
export function delay<T>(timeout: number): Operation<T, T>;
export function delay<T>(cb: (value: T, index: number, state: IterationState) => number): Operation<T, T>;

export function delay<T>(timeout: number | ((value: T, index: number, state: IterationState) => number)): Operation<T, T> {
    return createOperation(throwOnSync('delay'), delayAsync, arguments);
}

function delayAsync<T>(iterable: AsyncIterable<T>, timeout: number | ((value: T, index: number, state: IterationState) => number)): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const test = typeof timeout === 'function' && timeout;
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => {
                        if (a.done) {
                            return a;
                        }
                        const d: number = test ? test(a.value, index++, state) : timeout;
                        if (d < 0) {
                            return a; // negative delay => no timeout
                        }
                        return new Promise(resolve => {
                            setTimeout(() => resolve(a), d);
                        });
                    });
                }
            };
        }
    };
}
