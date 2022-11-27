import type {DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {takeLast as takeLastAsync} from './async';
import {takeLast as takeLastSync} from './sync';

/**
 * Emits up to `count` number of the last values.
 *
 * ```ts
 * import {pipe, takeLast} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     takeLast(2)
 * );
 *
 * console.log(...i); //=> 4, 5
 * ```
 *
 * @see
 *  - {@link last}
 *  - {@link take}
 *
 * @category Sync+Async
 */
export function takeLast<T>(count: number): DuelOperation<T, T> {
    return createDuelOperation<T, T>(takeLastSync, takeLastAsync, [count]);
}
