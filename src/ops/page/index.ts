import type {DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {page as pageAsync} from './async';
import {page as pageSync} from './sync';

/**
 * Splits values into pages of fixed size (last page can be smaller).
 *
 * ```ts
 * import {pipe, page} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     page(2)
 * );
 *
 * console.log(...i); //=> [1, 2], [3, 4], [5]
 * ```
 *
 * @throws `TypeError: 'Page size >= 1 is required: ...'` when `size` is less than 1 or not a `number`.
 *
 * @see
 *  - {@link split}
 * @category Sync+Async
 */
export function page<T>(size: number): DuelOperation<T, T[]> {
    return createDuelOperation<T, T[]>(pageSync, pageAsync, [size]);
}
