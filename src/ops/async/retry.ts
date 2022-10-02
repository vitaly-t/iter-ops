import {$A, IterationState, AsyncOperation} from '../../types';
import {isPromiseLike} from '../../typeguards';
import {createOperation, throwOnSync} from '../../utils';

/**
 * When the iterable rejects, retries getting the value specified number of times.
 *
 * Note that retries deplete values prior the operator that threw the error,
 * and so it is often used in combination with operator {@link repeat}.
 *
 * ```ts
 * import {pipe, toAsync, tap, retry} from 'iter-ops';
 *
 * const i = pipe(
 *     toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9]),
 *     tap(value => {
 *         if (value % 2 === 0) {
 *             throw new Error(`fail-${value}`); // throw for all even numbers
 *         }
 *     }),
 *     retry(1) // retry 1 time
 * );
 *
 * for await(const a of i) {
 *     console.log(a); // 1, 3, 5, 7, 9
 * }
 * ```
 *
 * Above, we end up with just odd numbers, because we do not provide any {@link repeat} logic,
 * and as a result, the `retry` simply jumps to the next value on each error.
 *
 * The method throws an error during iteration, if inside a synchronous pipeline.
 *
 * @see
 *  - {@link repeat}
 * @category Async-only
 */
export function retry<T>(attempts: number): AsyncOperation<T, T>;

/**
 * When the iterable rejects, the callback is to return the flag, indicating whether
 * we should retry getting the value one more time.
 *
 * The callback is only invoked when there is a failure, and it receives:
 * - `index` - index of the iterable value that we failed to acquire
 * - `attempts` - number of retry attempts made so far (starts with 0)
 * - `state` - state for the entire iteration session
 *
 * Note that retries deplete values prior the operator that threw the error,
 * and so it is often used in combination with operator {@link repeat}.
 *
 * Throws an error during iteration, if inside a synchronous pipeline.
 *
 * @see
 *  - {@link repeat}
 * @category Async-only
 */
export function retry<T>(
    cb: (
        index: number,
        attempts: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): AsyncOperation<T, T>;

export function retry(...args: unknown[]) {
    return createOperation(throwOnSync('retry'), retryAsync, args);
}

function retryAsync<T>(
    iterable: AsyncIterable<T>,
    retry:
        | number
        | ((
              index: number,
              attempts: number,
              state: IterationState
          ) => boolean | Promise<boolean>)
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = 0;
            const cb = typeof retry === 'function' && retry;
            let attempts = 0;
            const retriesNumber = !cb && retry > 0 ? retry : 0;
            let leftTries = retriesNumber;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i
                        .next()
                        .then((a) => {
                            index++;
                            attempts = 0;
                            leftTries = retriesNumber;
                            return a;
                        })
                        .catch((e) => {
                            if (cb) {
                                const b = (f: any) =>
                                    f ? this.next() : Promise.reject(e);
                                const r = cb(
                                    index,
                                    attempts++,
                                    state
                                ) as Promise<boolean>;
                                return isPromiseLike(r) ? r.then(b) : b(r);
                            }
                            if (leftTries) {
                                leftTries--;
                                return this.next();
                            }
                            return Promise.reject(e);
                        });
                },
            };
        },
    };
}
