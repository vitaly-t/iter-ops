import type {DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {isEmpty as isEmptyAsync} from './async';
import {isEmpty as isEmptySync} from './sync';

/**
 * Checks if the iterable is empty, and emits a boolean flag.
 *
 * ```ts
 * import {pipe, isEmpty} from 'iter-ops';
 *
 * const i = pipe(
 *     [],
 *     isEmpty()
 * );
 *
 * console.log(...i); //=> true
 *
 * console.log(i.first); //=> true
 * ```
 *
 * @see
 *  - {@link empty}
 *  - {@link defaultEmpty}
 * @category Sync+Async
 */
export function isEmpty(...args: unknown[]): DuelOperation<unknown, boolean> {
    return createDuelOperation(isEmptySync, isEmptyAsync, args);
}
