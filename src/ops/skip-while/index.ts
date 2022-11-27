import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {skipWhile as skipWhileAsync} from './async';
import {skipWhile as skipWhileSync} from './sync';

/**
 * Skips values while the predicate test succeeds.
 *
 * ```ts
 * import {pipe, skipWhile} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     skipWhile(a => a < 5) // skip while value < 5
 * );
 *
 * console.log(...i); //=> 5, 6, 7, 8, 9
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link skip}
 *  - {@link skipUntil}
 *  - {@link take}
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 *
 * @category Sync+Async
 */
export function skipWhile<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(skipWhileSync, skipWhileAsync, [cb]);
}
