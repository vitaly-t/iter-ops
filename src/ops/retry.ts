import {$A, $S, type IterationState, type Operation} from '../types';
import {isPromiseLike} from '../typeguards';
import {createOperation} from '../utils';

/**
 * When an iterable throws or rejects, it retries getting the value specified number of times.
 *
 * Note that retries deplete values prior the operator that threw the error, and so it is often
 * used in combination with operator {@link repeat}.
 *
 * ```ts
 * import {pipe, tap, retry} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     tap(value => {
 *         if (value % 2 === 0) {
 *             throw new Error(`fail-${value}`); // throw for all even numbers
 *         }
 *     }),
 *     retry(1) // retry 1 time
 * );
 *
 * console.log(...i); //=> 1, 3, 5, 7, 9
 * ```
 *
 * Above, we end up with just odd numbers, because we do not provide any {@link repeat} logic,
 * and as a result, the `retry` simply jumps to the next value on each error.
 *
 * @see
 *  - {@link repeat}
 * @category Sync+Async
 */
export function retry<T>(attempts: number): Operation<T, T>;

/**
 * When an iterable throws or rejects, the callback is to return the flag, indicating whether
 * we should retry getting the value one more time. When inside asynchronous pipeline,
 * the callback can also return `Promise<boolean>`.
 *
 * ```ts
 * import {pipe, tap, retry} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     tap(value => {
 *         if (value % 2 === 0) {
 *             throw new Error(`fail-${value}`); // throw for all even numbers
 *         }
 *     }),
 *     retry(({attempt}) => {
 *         // available properties: {attempt, error, index, state}
 *         return attempt < 3; // make up to 3 retry attempts
 *     })
 * );
 *
 * console.log(...i); //=> 1, 3, 5, 7, 9
 * ```
 *
 * The callback is only invoked when there is a failure, and it receives an object with the following properties:
 *
 * - `attempt` - attempt index so far (starts with 0)
 * - `error` - the error that was thrown
 * - `index` - index of the iterable value that threw/rejected
 * - `state` - state for the entire iteration session
 *
 * Note that retries deplete values prior the operator that threw the error,
 * and so it is often used in combination with operator {@link repeat}.
 *
 * @see
 *  - {@link repeat}
 * @category Sync+Async
 */
export function retry<T>(
    retry: (cb: {
        attempt: number;
        error: any;
        index: number;
        state: IterationState;
    }) => boolean | Promise<boolean>
): Operation<T, T>;

export function retry(...args: unknown[]) {
    return createOperation(retrySync, retryAsync, args);
}

type Retry<T> =
    | number
    | ((cb: {
          attempt: number;
          error: any;
          index: number;
          state: IterationState;
      }) => T);

function retrySync<T>(
    iterable: Iterable<T>,
    retry: Retry<boolean>
): Iterable<T> {
    if (typeof retry === 'number' && retry < 1) {
        // reuse the source when repeat is not needed;
        return iterable;
    }
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0;
            const cb = typeof retry === 'function' && retry;
            let attempt = 0;
            const retriesNumber = !cb && retry > 0 ? retry : 0;
            let leftTries = retriesNumber;
            return {
                next(): IteratorResult<T> {
                    do {
                        try {
                            const a = i.next();
                            index++;
                            attempt = 0;
                            leftTries = retriesNumber;
                            return a;
                        } catch (error) {
                            const r = cb && cb({attempt, index, error, state});
                            attempt++;
                            index++;
                            if (!r && !leftTries--) {
                                throw error;
                            }
                        }
                    } while (true);
                }
            };
        }
    };
}

function retryAsync<T>(
    iterable: AsyncIterable<T>,
    retry: Retry<boolean | Promise<boolean>>
): AsyncIterable<T> {
    if (typeof retry === 'number' && retry < 1) {
        // reuse the source when repeat is not needed;
        return iterable;
    }
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = 0;
            const cb = typeof retry === 'function' && retry;
            let attempt = 0;
            const retriesNumber = !cb && retry > 0 ? retry : 0;
            let leftTries = retriesNumber;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(
                        (a) => {
                            index++;
                            attempt = 0;
                            leftTries = retriesNumber;
                            return a;
                        },
                        (error) => {
                            if (cb) {
                                const b = (f: any) =>
                                    f
                                        ? this.next()
                                        : // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                                          Promise.reject(error);
                                const r = cb({
                                    attempt,
                                    index,
                                    error,
                                    state
                                }) as Promise<boolean>;
                                attempt++;
                                index++;
                                return isPromiseLike(r) ? r.then(b) : b(r);
                            }
                            if (leftTries) {
                                leftTries--;
                                return this.next();
                            }
                            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                            return Promise.reject(error);
                        }
                    );
                }
            };
        }
    };
}
