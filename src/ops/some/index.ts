import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {some as someAsync} from './async';
import {some as someSync} from './sync';

/**
 * Standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some Array.some} logic for the iterable,
 * extended with iteration state + async.
 *
 * It emits a `boolean`, indicating whether at least one element passes the predicate test.
 *
 * ```ts
 * import {pipe, some} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     some(a => a % 2 === 0) // checks if even numbers are present
 * );
 *
 * console.log(...i); //=> true
 *
 * console.log(i.first); //=> true
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some Array.some}
 *  - {@link every}
 * @category Sync+Async
 */
export function some<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, boolean> {
    return createDuelOperation<T, boolean>(someSync, someAsync, [cb]);
}
