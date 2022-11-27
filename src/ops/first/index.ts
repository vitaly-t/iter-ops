import type {DuelOperation, IterationState} from '../../types';
import {createDuelOperation} from '../../utils';

import {first as firstAsync} from './async';
import {first as firstSync} from './sync';

/**
 * Produces a one-value iterable, with the first emitted value.
 *
 * Without the optional predicate, it is the same as `take(1)`.
 *
 * ```ts
 * import {pipe, first} from 'iter-ops';
 *
 * const i = pipe(
 *     [10, 20, 30],
 *     first()
 * );
 *
 * console.log(...i); //=> 10
 *
 * console.log(i.first); //=> 10
 * ```
 *
 * When the optional predicate is provided, the first value satisfying it will be emitted.
 *
 * ```ts
 * import {pipe, first} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     first(a => a % 2 === 0) // first even number
 * );
 *
 * console.log(...i); //=> 2
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link last}
 *  - {@link take}
 *  - {@link takeLast}
 * @category Sync+Async
 */
export function first<T>(
    cb?: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(firstSync, firstAsync, [cb]);
}
