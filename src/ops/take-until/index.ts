import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {takeUntil as takeUntilAsync} from './async';
import {takeUntil as takeUntilSync} from './sync';

/**
 * Takes values until the predicate test succeeds.
 * The value for which predicate succeeds is excluded.
 *
 * ```ts
 * import {pipe, takeUntil} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     takeUntil(a => a > 2) // take until value > 2
 * );
 *
 * console.log(...i); //=> 1, 2
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
 *  - {@link takeWhile}
 *
 * @category Sync+Async
 */
export function takeUntil<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(takeUntilSync, takeUntilAsync, [cb]);
}
