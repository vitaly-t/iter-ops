import {IterationState, Piper} from '../types';

/**
 * Value index details, during "split" operation.
 */
export interface ISplitIndex {
    /**
     * Start Index - absolute value index.
     *
     * It is to guide you where you're at, relative to the start of the iterable.
     */
    start: number;

    /**
     * List Index - relative to the current list.
     * Index of the value within the currently accumulated list.
     *
     * Note that when split/toggle values are carried forward (carry > 0),
     * it starts with 1, as 0 refers to the value that was carried forward.
     *
     * When in "toggle" mode, it is undefined while between toggles.
     */
    list?: number;

    /**
     * Split Index - of resulting emits by the operator, starts with 0,
     * and incremented every time the operator emits data.
     *
     * When in "toggle" mode, it represents index of the toggle intervals.
     * Therefore, it starts as undefined, until the first toggle is triggerred,
     * at which point it becomes 0, staying unchanged while between toggles,
     * and incremented once inside the next toggle interval.
     */
    split?: number;
}

/**
 * Set of options that can be passed into "split" operator.
 */
export interface ISplitOptions {

    /**
     * Strategy for carrying every "toggle-ON" value.
     * It is used only when in "toggle" mode.
     */
    carryStart?: SplitValueCarry | number;

    /**
     * Strategy for carrying every "toggle-OFF" or "split" value.
     */
    carryEnd?: SplitValueCarry | number;

    /**
     * Changes what the "split" callback result represents.
     * By default, it signals when we find a split value.
     *
     * This option changes that into a toggle logic:
     *
     * We start collecting values into a new list when the callback returns true
     * one time, and we stop collecting values when it returns true the next time.
     * And we do so repeatedly, skipping values outside [true, ..., true] toggles.
     */
    toggle?: boolean;

    /**
     * By default, when there are no values between splits/toggles, an empty list is emitted.
     * We specifically do not produce null or anything else, in order to keep the output
     * signature automatically compatible with the input type of the "spread" operator.
     *
     * Setting this option forces to simply discard any empty list.
     *
     * Note that if you set option "carry" to "back" or "forward", it changes things:
     * - "carry" = "back" => an empty list is only possible at the very end,
     *   and "trim" will have no effect before that;
     * - "carry" = "forward" => an empty list is only possible at the very start,
     *   and after that "trim" will have no effect.
     */
    trim?: boolean;
}

/**
 * Strategy for carrying over split/toggle values.
 * It defines what to do with each value that triggers the split/toggle.
 *
 * Note that split operator treats this enum in non-strict manner:
 *  - any negative number is treated as "back"
 *  - any positive number is treated as "forward"
 *  - everything else is treated as "none"
 */
export enum SplitValueCarry {
    /**
     * Split/toggle value is carried back, to be the last value in the current list.
     */
    back = -1,

    /**
     * Split/toggle value is just a placeholder/gap, to be skipped.
     * This is the default.
     */
    none = 0,

    /**
     * Split/toggle value is carried forward, to make the first value in the next list.
     */
    forward = 1
}

/**
 * Splits values into separate lists when predicate returns true.
 * When option "toggle" is set, the split uses the toggle start/end logic.
 *
 * When you know only the start value of each block, you can use the default/split mode,
 * with carryEnd set to 1/forward (in case you do not want it skipped);
 *
 * When you know only the end value of each block, you can use the default/split mode,
 * with carryEnd set to -1/back (in case you do not want it skipped);
 *
 * When you know both start and end values of each block, you can use the toggle mode,
 * with carryStart set to 1/forward, and carryEnd set to -1/back, unless you want
 * either of those skipped, then leave them at 0/none.
 */
export function split<T>(cb: (value: T, index: ISplitIndex, state: IterationState) => boolean, options?: ISplitOptions): Piper<T, T[]> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T[]> {
            const i = iterable[Symbol.iterator](); // source iterator
            const state = {}; // iteration session state

            // quick access to the options:
            const carryStart = options?.carryStart ? (options?.carryStart < 0 ? -1 : (options?.carryStart > 0 ? 1 : 0)) : 0;
            const carryEnd = options?.carryEnd ? (options?.carryEnd < 0 ? -1 : (options?.carryEnd > 0 ? 1 : 0)) : 0;
            const toggle = !!options?.toggle;
            const trim = !!options?.trim;

            // indexes:
            let startIndex = 0;
            let splitIndex = toggle ? undefined : 0;
            let listIndex = toggle ? undefined : 0;

            // index + list must be initialized during iteration,
            // in case the predicate changes them between calls;
            let index: ISplitIndex; // current index details
            let list: T[]; // current list of values

            let collecting = !toggle; // indicates when we are collecting values
            let finished = false; // indicate when we are all done;

            let prev: IteratorResult<T> | null; // previous value when carry=forward

            return {
                next(): IteratorResult<T[]> {
                    index = {
                        start: startIndex++,
                        split: splitIndex,
                        list: listIndex
                    };
                    list = [];

                    let v: IteratorResult<T>; // next value object
                    do {
                        v = i.next();

                        if (prev) {
                            // previous trigger value being moved forward;
                            list.push(prev.value);
                            prev = null;
                        }

                        if (!v.done) {
                            const r = cb(v.value, index, state); // callback result

                            if (r) {
                                const carry = collecting ? carryEnd : carryStart;

                                // split has been triggerred;
                                if (carry) {
                                    if (carry < 0) {
                                        list.push(v.value); // add value to the current list:
                                    } else {
                                        prev = v; // save for the list forward
                                    }
                                }
                                if (toggle) {
                                    collecting = !collecting;
                                    if (collecting) {
                                        continue;
                                    }
                                    return {value: list};
                                }
                                if (trim && !list.length) {
                                    continue;
                                }
                                break;
                            }
                            if (collecting) {
                                // active toggle, or in split mode
                                list.push(v.value);
                            }
                        }
                    } while (!v.done);
                    if (!finished) {
                        finished = !!v.done;
                        if (collecting && (!trim || list.length)) {
                            return {value: list};
                        }
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
