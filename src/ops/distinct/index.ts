import type {DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';
import {distinct as distinctAsync} from './async';
import {distinct as distinctSync} from './sync';

/**
 * Emits unique values, with optional key selector.
 *
 * ```ts
 * import {pipe, distinct} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 1, 1, 2, 2, 2, 3, 3],
 *     distinct() // selector not needed for simple types
 * );
 *
 * console.log(...i); //=> 1, 2, 3
 * ```
 *
 * With optional selector function:
 *
 * ```ts
 * import {pipe, distinct} from 'iter-ops';
 *
 * const i = pipe(
 *     [{a: 1}, {a: 1}, {a: 2}, {a: 2}],
 *     distinct(v => v.a)
 * );
 *
 * console.log(...i); //=> {a: 1}, {a: 2}
 * ```
 *
 * @category Sync+Async
 */
export function distinct<T, K>(
    keySelector?: (value: T, index: number) => K
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(distinctSync, distinctAsync, [
        keySelector,
    ]);
}
