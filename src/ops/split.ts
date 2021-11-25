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
     * Split Index - of emits by the operator.
     */
    split: number;
}

/**
 * Splits values into separate lists when predicate returns true.
 *
 * The behavior is similar to String.split logic:
 * - values on which the split is triggered are excluded;
 * - splits without current values emit null-s.
 */
export function split<T>(cb: (value: T, index: ISplitIndex, state: IterationState) => boolean): Piper<T, T[] | null> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T[]> {
            // const i = iterable[Symbol.iterator]();
            return {
                next(): IteratorResult<T[]> {
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
