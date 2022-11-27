import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {last as lastAsync} from './async';
import {last as lastSync} from './sync';

/**
 * Produces a one-value iterable, with the last emitted value.
 *
 * ```ts
 * import {pipe, last} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     last()
 * );
 *
 * console.log(...i); //=> 3
 *
 * console.log(i.first); //=> 3
 * ```
 *
 * When the optional predicate is provided, the last value satisfying it will be emitted.
 *
 * ```ts
 * import {pipe, last} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     last(a => a % 2 === 0) // last even number
 * );
 *
 * console.log(i.first); //=> 8
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link takeLast}
 *  - {@link first}
 * @category Sync+Async
 */
export function last<T>(
    cb?: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(lastSync, lastAsync, [cb]);
}
