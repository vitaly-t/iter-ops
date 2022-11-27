import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {split as splitAsync} from './async';
import {split as splitSync} from './sync';

import type {ISplitIndex, ISplitOptions} from './types';
export * from './types';

/**
 * Splits values into separate lists when predicate returns `true` (or resolves with `true`):
 *
 * ```ts
 * import {pipe, split} from 'iter-ops';
 *
 * const input = [1, 2, 0, 3, 4, 0, 5, 6];
 *
 * const i = pipe(input, split(a => a === 0));
 *
 * console.log(...i); //=> [1, 2] [3, 4] [5, 6]
 * ```
 *
 * When option `toggle` is set, the split uses the toggle start/end logic:
 *
 * ```ts
 * import {pipe, split} from 'iter-ops';
 *
 * const input = [1, 2, 0, 3, 4, 0, 5, 6, 0, 7, 8];
 *
 * const i = pipe(input, split(a => a === 0, {toggle: true}));
 *
 * console.log(...i); //=> [3, 4] [7, 8]
 *
 * // i.e. first toggle starts collection, second one stops, third starts again, and so on.
 * ```
 *
 * When you know only the split value of each block, you can use the default split mode,
 * with `carryEnd` set to `1/forward` (in case you do not want it skipped):
 *
 * ```ts
 * import {pipe, split, SplitValueCarry} from 'iter-ops';
 *
 * const input = [1, 2, 0, 3, 4, 0, 5, 6, 0, 7, 8];
 *
 * const i = pipe(input, split(a => a === 0, {carryEnd: SplitValueCarry.forward}));
 *
 * console.log(...i); //=> [ 1, 2 ] [ 0, 3, 4 ] [ 0, 5, 6 ] [ 0, 7, 8 ]
 * ```
 *
 * When you know only the end value of each block, you can use the default split mode,
 * with `carryEnd` set to `-1/back` (in case you do not want it skipped):
 *
 * ```ts
 * import {pipe, split, SplitValueCarry} from 'iter-ops';
 *
 * const input = [1, 2, 0, 3, 4, 0, 5, 6, 0, 7, 8];
 *
 * const i = pipe(input, split(a => a === 0, {carryEnd: SplitValueCarry.back}));
 *
 * console.log(...i); //=> [ 1, 2, 0 ] [ 3, 4, 0 ] [ 5, 6, 0 ] [ 7, 8 ]
 * ```
 *
 * When you know both start and end values of each block, you can use the `toggle` mode,
 * with `carryStart` set to `1/forward`, and `carryEnd` set to `-1/back`, unless you want
 * either of those skipped, then leave them at `0/none`.
 *
 * Note that in `toggle` mode, you cannot use `carryStart=back` (it will be ignored),
 * because it would delay emission of the current block indefinitely, plus carrying
 * block start backward doesn't make much sense anyway.
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link https://github.com/vitaly-t/iter-ops/wiki/Split Split WiKi}
 *  - {@link page}
 * @category Sync+Async
 */
export function split<T>(
    cb: (
        value: T,
        index: ISplitIndex,
        state: IterationState
    ) => boolean | Promise<boolean>,
    options?: ISplitOptions
): DuelOperation<T, T[]> {
    return createDuelOperation<T, T[]>(splitSync, splitAsync, [cb, options]);
}
