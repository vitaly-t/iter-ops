import {$A, type Operation, type IterationState} from '../../types';
import {createOperation, throwOnSync} from '../../utils';

/**
 * Delays each value by the specified timeout (including the first one).
 * When the timeout is a negative number, no delay added.
 *
 * ```ts
 * import {pipe, toAsync, delay} from 'iter-ops';
 *
 * const data = [1, 2, 3, 4, 5]; // some synchronous data
 *
 * const i = pipe(
 *     toAsync(data), // make asynchronous
 *     delay(1000)
 * );
 *
 * for await(const a of i) {
 *     console.log(a); //=> 1, 2, 3, 4, 5 (with 1s delay)
 * }
 * ```
 *
 * Note that passing in `timeout = 0`, or returning the same from the callback,
 * still uses the `timeout` function, just like `setTimeout(0)`, which can be used
 * for throttling. In order to fully deactivate, it needs a negative `timeout`.
 *
 * If you do not want to delay the first value, check out {@link https://github.com/vitaly-t/iter-ops-extras/blob/main/src/interval.ts interval}.
 *
 * @throws `Error: 'Operator "delay" requires asynchronous pipeline'` when used inside a synchronous pipeline.
 *
 * @see
 *  - {@link https://github.com/vitaly-t/iter-ops-extras/blob/main/src/interval.ts interval}
 *  - {@link throttle}
 *  - {@link !timeout timeout}
 *
 * @category Async-only
 */
export function delay<T>(timeout: number): Operation<T, T>;

/**
 * Delays each value by the specified timeout (as returned from the callback).
 * When the timeout is a negative number, it is not added.
 *
 * Note that it doesn't support return of `Promise<number>` on purpose, to avoid
 * confusion with what operator {@link throttle} does.
 *
 * @throws `Error: 'Operator "delay" requires asynchronous pipeline'` when used inside a synchronous pipeline.
 *
 * @category Async-only
 */
export function delay<T>(
    cb: (value: T, index: number, state: IterationState) => number
): Operation<T, T>;

export function delay(...args: unknown[]) {
    return createOperation(throwOnSync('delay'), delayAsync, args);
}

function delayAsync<T>(
    iterable: AsyncIterable<T>,
    timeout:
        | number
        | ((value: T, index: number, state: IterationState) => number)
): AsyncIterable<T> {
    if (typeof timeout === 'number' && timeout < 0) {
        return iterable; // just reuse the source iterable
    }
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const cb = typeof timeout === 'function' && timeout;
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (a.done) {
                            return a;
                        }
                        const delay: number = cb
                            ? cb(a.value, index++, state)
                            : timeout;
                        return delay < 0
                            ? a
                            : new Promise((resolve) =>
                                  setTimeout(() => resolve(a), delay)
                              );
                    });
                }
            };
        }
    };
}
