import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {repeat as repeatAsync} from './async';
import {repeat as repeatSync} from './sync';

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
 * @category Sync+Async
 */
export function repeat<T>(count: number): DuelOperation<T, T>;

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
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link retry}
 * @category Sync+Async
 */
export function repeat<T>(
    cb: (
        value: T,
        index: number,
        count: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, T>;

export function repeat(...args: unknown[]) {
    return createDuelOperation(repeatSync, repeatAsync, args);
}
