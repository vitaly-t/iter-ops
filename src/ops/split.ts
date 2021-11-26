import {IterationState, Piper} from '../types';

export interface ISplitIndex {
    /**
     * Start Index - absolute value index.
     */
    start: number;

    /**
     * List Index - relative to the current list.
     */
    list: number;

    /**
     * Split Index - of resulting emits by the operator.
     */
    split: number;
}

export interface ISplitOptions {

    /**
     * Defines where to carry the split value.
     * Default is none, means
     */
    carry?: SplitValueCarry;

    /**
     * By default, when there are no values between splits,
     * an empty list is emitted.
     *
     * Setting this option forces to discard any such gap.
     */
    trim?: boolean;
}

/**
 * Strategy for carrying over the split value.
 * It defines what should be done with the value that triggerred the split.
 *
 * Note that "split" operator treats this enum in non-strict manner:
 *  - any negative number is treated as "back"
 *  - any positive number value is treated as "forward"
 *  - everything else is treated as "none"
 */
export enum SplitValueCarry {
    /**
     * Split values represent the end of each list,
     * and as such, they are to be carried back,
     * to be the last value in the current list.
     */
    back = -1,

    /**
     * Split values are just placeholders/gaps, to be skipped.
     * This is the default.
     */
    none = 0,

    /**
     * Split values represent beginning of the next list,
     * and as such, they are to be carried forward,
     * to make the first value in the next list.
     */
    forward = 1
}

/**
 * Splits values into separate lists when predicate returns true.
 *
 * The behavior is similar to String.split logic:
 * - values on which the split is triggered are excluded;
 * - splits without current values emit null-s.
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
