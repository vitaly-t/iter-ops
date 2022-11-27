import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {skipUntil as skipUntilAsync} from './async';
import {skipUntil as skipUntilSync} from './sync';

/**
 * Skips values until the predicate test succeeds.
 * The value for which predicate succeeds is not skipped.
 *
 * ```ts
 * import {pipe, skipUntil} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     skipUntil(a => a > 5) // skip until value > 5
 * );
 *
 * console.log(...i); //=> 6, 7, 8, 9
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link skip}
 *  - {@link skipWhile}
 *  - {@link take}
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 *
 * @category Sync+Async
 */
export function skipUntil<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(skipUntilSync, skipUntilAsync, [cb]);
}
