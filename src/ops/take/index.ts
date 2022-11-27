import type {DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {take as takeAsync} from './async';
import {take as takeSync} from './sync';

/**
 * Emits up to `count` number of values, then stops iteration.
 *
 * ```ts
 * import {pipe, take} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     take(2)
 * );
 *
 * console.log(...i); //=> 1, 2
 * ```
 *
 * @see
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 *
 * @category Sync+Async
 */
export function take<T>(count: number): DuelOperation<T, T> {
    return createDuelOperation<T, T>(takeSync, takeAsync, [count]);
}
