import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {indexBy as indexByAsync} from './async';
import {indexBy as indexBySync} from './sync';

import type {IIndexedValue} from './types';
export * from './types';

/**
 * Emits indexed values that pass the predicate test.
 *
 * ```ts
 * import {pipe, indexBy} from 'iter-ops';
 *
 * const i = pipe(
 *     [12, 7, 30, 9],
 *     indexBy(a => a % 2 === 0) // index even numbers
 * );
 *
 * console.log(...i); //=> {index: 0, value: 12}, {index: 2, value: 30}
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link IIndexedValue}
 * @category Sync+Async
 */
export function indexBy<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, IIndexedValue<T>> {
    return createDuelOperation<T, IIndexedValue<T>>(indexBySync, indexByAsync, [
        cb,
    ]);
}
