import {$S, IterationState, SyncOperation} from '../../types';

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
 * @see
 *  - {@link https://github.com/vitaly-t/iter-ops/wiki/Split Split WiKi}
 *  - {@link page}
 * @category Operations
 */
export function split<T>(
    cb: (value: T, index: ISplitIndex, state: IterationState) => boolean,
    options?: ISplitOptions
): SyncOperation<T, T[]> {
    return (iterable) => ({
        [$S](): Iterator<T[]> {
            const i = iterable[$S]();
            const state: IterationState = {};

            // quick access to the options:
            const carryStart = options?.carryStart
                ? options?.carryStart < 0
                    ? -1
                    : options?.carryStart > 0
                    ? 1
                    : 0
                : 0;
            const carryEnd = options?.carryEnd
                ? options?.carryEnd < 0
                    ? -1
                    : options?.carryEnd > 0
                    ? 1
                    : 0
                : 0;
            const toggle = !!options?.toggle;

            // all indexes:
            let startIndex = 0;
            let listIndex = 0;
            let splitIndex = 0;

            let collecting = !toggle; // indicates when we are collecting values
            let finished = false; // indicates when we are all done

            let prev: IteratorResult<T> | null; // previous value when carrying forward

            return {
                next(): IteratorResult<T[]> {
                    const list: T[] = [];
                    let v: IteratorResult<T>; // next value object
                    do {
                        if (prev) {
                            // previous trigger value is being moved forward;
                            list.push(prev.value);
                            prev = null;
                        }
                        v = i.next();
                        if (!v.done) {
                            const index: ISplitIndex = {
                                start: startIndex++,
                                list: listIndex,
                                split: splitIndex,
                            };
                            if (cb(v.value, index, state)) {
                                // split/toggle has been triggered;
                                const carry = collecting
                                    ? carryEnd
                                    : carryStart;
                                if (carry) {
                                    if (carry < 0) {
                                        list.push(v.value);
                                    } else {
                                        prev = v; // carry "forward", save for the next list
                                    }
                                }
                                if (toggle) {
                                    collecting = !collecting;
                                    listIndex = collecting && carry > 0 ? 1 : 0;
                                    if (collecting) {
                                        splitIndex++;
                                        continue;
                                    }
                                    return {value: list, done: false};
                                }
                                listIndex = carry > 0 ? 1 : 0;
                                splitIndex++;
                                break;
                            }
                            if (collecting) {
                                listIndex++;
                                list.push(v.value);
                            }
                        }
                    } while (!v.done);
                    if (!finished) {
                        finished = !!v.done;
                        if (collecting) {
                            return {value: list, done: false};
                        }
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    });
}
