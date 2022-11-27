import {$S, IterationState, SyncOperation} from '../../types';

/**
 * Repeats every value specified number of times.
 *
 * ```ts
 * import {pipe, repeat} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     repeat(2)
 * );
 *
 * console.log(...i); //=> 1, 1, 1, 2, 2, 2, 3, 3, 3
 * ```
 *
 * @see
 *  - {@link retry}
 * @category Operations
 */
export function repeat<T>(count: number): SyncOperation<T, T>;

/**
 * Repeats values while passing predicate test.
 * - `value` - repeated value
 * - `index` - original value index
 * - `count` - repeats count thus far (starts with 0)
 * - `state` - iteration state
 *
 * ```ts
 * import {pipe, repeat} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7],
 *     repeat((a, idx, c) => a % 2 === 0 && c < 2) // repeat even numbers 2 times
 * );
 *
 * console.log(...i); //=> 1, 2, 2, 2, 3, 4, 4, 4, 5, 6, 6, 6, 7
 * ```
 *
 * @see
 *  - {@link retry}
 * @category Operations
 */
export function repeat<T>(
    cb: (
        value: T,
        index: number,
        count: number,
        state: IterationState
    ) => boolean
): SyncOperation<T, T>;

export function repeat<T>(
    count:
        | number
        | ((
              value: T,
              index: number,
              count: number,
              state: IterationState
          ) => boolean)
): SyncOperation<T, T> {
    return (iterable) => ({
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            const cb = typeof count === 'function' && count;
            const initialCount = !cb && count > 0 ? count : 0;
            let copyCount = initialCount;
            let index = -1,
                copied = 0,
                start = true,
                a: IteratorResult<T>;
            return {
                next(): IteratorResult<T> {
                    if (start) {
                        a = i.next();
                        start = false;
                        index++;
                        copied = 0;
                        copyCount = initialCount;
                    }
                    if (a.done) {
                        return a;
                    }
                    if (cb) {
                        start = !cb(a.value, index, copied++, state);
                        return a;
                    }
                    if (copyCount) {
                        copyCount--;
                    } else {
                        start = true;
                    }
                    return a;
                },
            };
        },
    });
}
