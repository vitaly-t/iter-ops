/*
If initialValue is specified, that also causes currentValue to be initialized to the first value in the array.
If initialValue is not specified, previousValue is initialized to the first value in the array, and currentValue
is initialized to the second value in the array.
*/
import {Terminator} from './common';

export function reduce<T>(cb: (previousValue: T, currentValue: T, index: number) => T, initialValue?: T): Terminator<T> {
    return () => ({
        process(iterator: Iterable<T>) {
            let index = 0, prev = initialValue as any;
            for (const a of iterator) {
                prev = cb(prev, a, index++);
            }
            return prev;
        }
    })
}
