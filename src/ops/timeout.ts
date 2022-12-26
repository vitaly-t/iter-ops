import {$A, $S, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Ends iteration after a specified number of milliseconds (from the beginning of iteration).
 * When `ms` < 0, the timeout is deactivated.
 *
 * Optional callback `cb` is invoked when timeout is reached before iteration is over.
 *
 * ```ts
 * import {pipe, toAsync, delay, timeout} from 'iter-ops';
 *
 * const i = pipe(
 *            toAsync([1, 2, 3, 4]),
 *            delay(10), // an async operation that takes 10ms each
 *            timeout(18, (count) => {
 *                // timeout occurred (failed to process all items);
 *                // only 'count' number of items were processed.
 *            })
 *          );
 *
 * (async function() {
 *     for await(const a of i) {
 *         console.log(a); //=> 1, 2
 *     }
 * })();
 *
 * // We never get 3, 4 above, as iteration times out after 18ms.
 * ```
 *
 * It works synchronously in a similar way:
 *
 * ```ts
 * import {pipe, tap, timeout} from 'iter-ops';
 *
 * const i = pipe(
 *            [1, 2, 3, 4],
 *            tap(() => {
 *                sleep(5); // artificially delaying each iteration step
 *            }),
 *            timeout(8)
 *          );
 *
 * console.log(...i); //=> 1, 2 (we never get 3, 4 due to the timeout)
 *
 * // sync sleep helper (without CPU load):
 * function sleep(t: number) {
 *     const arr = new Int32Array(new SharedArrayBuffer(4));
 *     Atomics.wait(arr, 0, 0, Math.max(1, t | 0));
 * }
 * ```
 *
 * Note that the examples above may not always produce a consistent result, as they rely on a race condition,
 * which depends on the OS, your current CPU load and JavaScript engine.
 *
 * @param ms - Timeout in milliseconds. Passing in a negative number deactivates the timeout.
 *
 * @param [cb] - Notification of when iteration stops due to the timeout,
 * with parameter `count` - the number of items processed before timeout.
 *
 * @see
 *   - {@link delay}
 * @category Sync+Async
 */
export function timeout<T>(
    ms: number,
    cb?: (count: number) => void
): Operation<T, T>;

export function timeout(...args: unknown[]) {
    return createOperation(timeoutSync, timeoutAsync, args);
}

function timeoutSync<T>(
    iterable: Iterable<T>,
    ms: number,
    cb?: (count: number) => void
): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            if (ms < 0) {
                // timeout is inactive;
                return i;
            }
            let count = 0; // number of items processed
            let start: number;
            let done = false;
            return {
                next(): IteratorResult<T> {
                    if (done) {
                        return {value: undefined, done};
                    }
                    const now = Date.now();
                    start = start || now;
                    if (now - start > ms) {
                        done = true;
                        if (typeof cb === 'function') {
                            cb(count); // notify of the timeout
                        }
                        return {value: undefined, done};
                    }
                    count++;
                    return i.next();
                },
            };
        },
    };
}

function timeoutAsync<T>(
    iterable: AsyncIterable<T>,
    ms: number,
    cb?: (index: number) => void
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            if (ms < 0) {
                // timeout is inactive;
                return i;
            }
            let count = 0; // number of items processed
            let done = false;
            const resolutions: ((res: IteratorResult<any>) => void)[] = [];
            const rejections: ((err: any) => void)[] = [];
            const timeoutId = setTimeout(() => {
                done = true;
                if (typeof cb === 'function') {
                    try {
                        cb(count); // notify of the timeout
                    } catch (err) {
                        rejections.forEach((r) => r(err));
                        return;
                    }
                }
                resolutions.forEach((r) => r({value: undefined, done}));
            }, ms);
            // istanbul ignore else;
            if (typeof timeoutId.unref === 'function') {
                timeoutId.unref();
            }
            return {
                next(): Promise<IteratorResult<T>> {
                    if (done) {
                        return Promise.resolve({value: undefined, done});
                    }
                    return new Promise((resolve, reject) => {
                        resolutions.push(resolve);
                        rejections.push(reject);
                        i.next()
                            .then((data) => {
                                if (done) {
                                    return; // we have timed out
                                }
                                if (data.done) {
                                    clearTimeout(timeoutId);
                                    done = true;
                                }
                                count++;
                                resolve(data);
                            })
                            .catch((err) => {
                                clearTimeout(timeoutId);
                                done = true;
                                reject(err);
                            });
                    });
                },
            };
        },
    };
}
