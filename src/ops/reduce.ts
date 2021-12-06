import {IterationState, Operation} from '../types';

/**
 * Standard reducer for the iterable, extended for supporting iteration state.
 *
 * See also: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
 */
export function reduce<T>(cb: (previousValue: T, currentValue: T, index: number, state: IterationState) => T, initialValue?: T): Operation<T, T> {
    return null as any;
    /*
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let done = false;
            return {
                next(): IteratorResult<T> {
                    let value;
                    if (done) {
                        return {value, done};
                    }
                    value = initialValue as T;
                    let index = 0, a;
                    while (!(a = i.next()).done) {
                        if (!index++ && value === undefined) {
                            value = a.value;
                            continue;
                        }
                        value = cb(value, a.value, index++, state);
                    }
                    done = true;
                    return {value};
                }
            };
        }
    });*/
}
