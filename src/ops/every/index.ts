import type {DuelOperation, IterationState} from '../../types';
import {createDuelOperation} from '../../utils';

import {every as everyAsync} from './async';
import {every as everySync} from './sync';

/**
 * Standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every Array.every} logic for the iterable,
 * extended with iteration state + async.
 *
 * It emits a `boolean`, indicating whether all elements pass the predicate test.
 *
 * ```ts
 * import {pipe, every} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     every(a => a % 2 === 0) // checks if every number is even
 * );
 *
 * console.log(...i); //=> false
 *
 * console.log(i.first); //=> false
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every Array.every}
 *  - {@link some}
 * @category Sync+Async
 */
export function every<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, boolean> {
    return createDuelOperation<T, boolean>(everySync, everyAsync, [cb]);
}
