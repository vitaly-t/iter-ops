/*
If initialValue is specified, that also causes currentValue to be initialized to the first value in the array.
If initialValue is not specified, previousValue is initialized to the first value in the array, and currentValue
is initialized to the second value in the array.
*/
import {Piper} from './common';

// TODO: this needs to be updated, for the types also.
export function reduce<T>(cb: (previousValue: T, currentValue: T, index: number) => T, initialValue?: T): Piper<T, T> {
    return (iterator: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            let value = initialValue as T, done = false;
            return {
                next(): IteratorResult<T> {
                    if (!done) {
                        let index = 0;
                        for (const curr of iterator) {
                            if (!index++ && value === undefined) {
                                value = curr;
                                continue;
                            }
                            value = cb(value, curr, index++);
                        }
                        done = true;
                        return {value};
                    }
                    return {value, done}
                }
            };
        }
    });
}
