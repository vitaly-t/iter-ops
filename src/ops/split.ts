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
     *
     * Index of the value within the currently accumulated list.
     * When in "toggle" mode, it is undefined while between toggles.
     */
    list?: number;

    /**
     * Split Index - of resulting emits by the operator.
     * It is incremented every time the operator emits data.
     */
    split: number;
}

/**
 * Set of options that can be passed into "split" operator.
 */
export interface ISplitOptions {

    /**
     * Strategy for carrying the split/toggle value.
     *
     * It is treated as a number (see SplitValueCarry).
     */
    carry?: SplitValueCarry | number;

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
     * By default, when there are no values between splits/toggles,
     * an empty list is emitted.
     *
     * Setting this option forces to discard any empty list.
     */
    trim?: boolean;
}

/**
 * Strategy for carrying over split/toggle values.
 * It defines what to do with each value that triggers the split/toggle.
 *
 * Note that "split" operator treats this enum in non-strict manner:
 *  - any negative number is treated as "back"
 *  - any positive number is treated as "forward"
 *  - everything else is treated as "none"
 */
export enum SplitValueCarry {
    /**
     * Split/toggle values represent the end of each list, and as such,
     * they are to be carried back, to be the last value in the current list.
     */
    back = -1,

    /**
     * Split/toggle values are just placeholders/gaps, to be skipped.
     * This is the default.
     */
    none = 0,

    /**
     * Split/toggle values represent beginning of the next list,
     * and as such, they are to be carried forward,
     * to make the first value in the next list.
     */
    forward = 1
}

/**
 * Splits values into separate lists when predicate returns true.
 * When option "toggle" is set, the split uses the toggle logic.
 */
export function split<T>(cb: (value: T, index: ISplitIndex, state: IterationState) => boolean, options?: ISplitOptions): Piper<T, T[] | null> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T[] | null> {
            const i = iterable[Symbol.iterator]();
            const state = {};
            const index: ISplitIndex = {
                start: 0,
                list: 0,
                split: 0
            };
            return {
                // TODO: Not sure if exact split logic is necessary;
                //  maybe we shouldn't emit null ever?
                next(): IteratorResult<T[] | null> {
                    const list: T[] = [];
                    let a;
                    while (!(a = i.next()).done) {
                        if (cb(a.value, index, state)) {
                            return {value: list.length ? list : null};
                        }
                        list.push(a.value);
                    }
                    if (list.length) {
                        return {value: list};
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
