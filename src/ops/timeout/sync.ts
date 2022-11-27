import {$S, SyncOperation} from '../../types';

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
 * @param ms - Timeout in milliseconds. Passing in a negative number deactivates the timeout.
 *
 * @param [cb] - Notification of when iteration stops due to the timeout,
 * with parameter `count` - the number of items processed before timeout.
 *
 * @see
 *   - {@link delay}
 *
 * @category Operations
 */
export function timeout<T>(
    ms: number,
    cb?: (count: number) => void
): SyncOperation<T, T> {
    return (iterable) => ({
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            if (ms < 0) {
                // timeout is inactive;
                return i;
            }
            let count = 0; // number of items processed
            let start: number;
            return {
                next(): IteratorResult<T> {
                    const now = Date.now();
                    start = start || now;
                    if (now - start > ms) {
                        if (typeof cb === 'function') {
                            cb(count); // notify of the timeout
                        }
                        return {value: undefined, done: true};
                    }
                    count++;
                    return i.next();
                },
            };
        },
    });
}
