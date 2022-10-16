import {$A, $S, IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * **New in v2.0.0**
 *
 * Ends iteration after a specified number of milliseconds (from the beginning of iteration).
 *
 * Optional callback `cb` is invoked when timeout is reached before iteration is over.
 *
 * ```ts
 * import {pipe, toAsync, delay, timeout} from 'iter-ops';
 *
 * const i = pipe(
 *          toAsync([1, 2, 3]),
 *          delay(10), // an async operation that takes 10ms each
 *          timeout(18)
 *          );
 *
 * (async function() {
 *     for await(const a of i) {
 *         console.log(a); //=> 1, 2
 *     }
 * })();
 *
 * // We never get 3 above, as iteration times out after 18ms.
 * ```
 *
 * @category Sync+Async
 */
export function timeout<T>(
    ms: number,
    cb?: (count: number, state: IterationState) => void
): Operation<T, T>;

export function timeout(...args: unknown[]) {
    return createOperation(timeoutSync, timeoutAsync, args);
}

function timeoutSync<T>(
    iterable: Iterable<T>,
    ms: number,
    cb?: (count: number, state: IterationState) => void
): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            ms = ms > 0 ? ms : 0; // ignore negative or invalid timeouts
            const i = iterable[$S]();
            const state: IterationState = {};
            let count = 0; // number of items processed
            let start: number;
            return {
                next(): IteratorResult<T> {
                    const now = Date.now();
                    start = start || now;
                    if (now - start > ms) {
                        if (typeof cb === 'function') {
                            cb(count, state); // notify of the timeout
                        }
                        return {value: undefined, done: true};
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
    cb?: (index: number, state: IterationState) => void
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            ms = ms > 0 ? ms : 0; // ignore negative or invalid timeouts
            const i = iterable[$A]();
            const state: IterationState = {};
            let count = 0; // number of items processed
            let start: number;
            return {
                next(): Promise<IteratorResult<T>> {
                    const now = Date.now();
                    start = start || now;
                    if (now - start > ms) {
                        if (typeof cb === 'function') {
                            cb(count, state); // notify of the timeout
                        }
                        return Promise.resolve({value: undefined, done: true});
                    }
                    count++;
                    return i.next();
                },
            };
        },
    };
}
