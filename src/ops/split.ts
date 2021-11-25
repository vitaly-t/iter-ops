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
