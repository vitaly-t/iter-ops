import type {DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {toArray as toArrayAsync} from './async';
import {toArray as toArraySync} from './sync';

/**
 * Accumulates all values and emits an array.
 *
 * ```ts
 * import {pipe, toArray} from 'iter-ops';
 *
 * const i = pipe([1, 2, 3], toArray());
 *
 * console.log(i.first); //=> [1, 2, 3]
 * ```
 *
 * @see
 *  - {@link aggregate}
 *  - {@link spread}
 *  - {@link flat}
 * @category Sync+Async
 */
export function toArray<T>(): DuelOperation<T, T[]> {
    return createDuelOperation<T, T[]>(toArraySync, toArrayAsync);
}
