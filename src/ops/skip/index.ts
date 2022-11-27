import type {DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {skip as skipAsync} from './async';
import {skip as skipSync} from './sync';

/**
 * Starts emitting values after `count` number of values.
 *
 * ```ts
 * import {pipe, skip} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     skip(2)
 * );
 *
 * console.log(...i); //=> 3, 4, 5
 * ```
 *
 * @see
 *  - {@link skipUntil}
 *  - {@link skipWhile}
 *
 * @category Sync+Async
 */
export function skip<T>(count: number): DuelOperation<T, T> {
    return createDuelOperation<T, T>(skipSync, skipAsync, [count]);
}
