import type {DuelOperation, FlattenAsync} from '../../types';
import {createDuelOperation} from '../../utils';

import {flat as flatAsync} from './async';
import {flat as flatSync} from './sync';

/**
 * Expands / flattens sub-iterables up to the specified `depth` (default is 1).
 *
 * ```ts
 * import {pipe, flat} from 'iter-ops';
 *
 * const i = pipe(
 *     ['one', [2, 3, [4, 5]]],
 *     flat(2)
 * );
 *
 * console.log(...i); //=> 'o', 'n', 'e', 2, 3, 4, 5
 * ```
 *
 * It implements the logic consistent with {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat Array.prototype.flat()},
 * handling non-iterable values without throwing errors (unlike {@link spread}), and with optional `depth` support.
 *
 * Note that when handling a synchronous iterable, this operator can only expand synchronous sub-iterables.
 * But when handling an asynchronous iterable, it can expand mixed sub-iterables, i.e. any combination of
 * synchronous and asynchronous sub-iterables.
 *
 * Compare it to a more strict {@link spread} operator.
 *
 * @see
 *  - {@link spread}
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat Array.prototype.flat()}
 * @category Sync+Async
 */
export function flat<T, N extends number = 1>(
    depth?: N
): DuelOperation<T, FlattenAsync<T, N>> {
    return createDuelOperation<T, FlattenAsync<T, N>>(
        flatSync as any,
        flatAsync as any,
        [depth]
    );
}
