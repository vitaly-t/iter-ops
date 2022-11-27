import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {takeWhile as takeWhileAsync} from './async';
import {takeWhile as takeWhileSync} from './sync';

/**
 * Takes values while the predicate test succeeds.
 *
 * ```ts
 * import {pipe, takeWhile} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     takeWhile(a => a < 5) // take while value < 5
 * );
 *
 * console.log(...i); //=> 1, 2, 3, 4
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link skip}
 *  - {@link skipUntil}
 *  - {@link skipWhile}
 *  - {@link take}
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *
 * @category Sync+Async
 */
export function takeWhile<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(takeWhileSync, takeWhileAsync, [cb]);
}
