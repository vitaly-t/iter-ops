import {Piper} from '../types';

/**
 * Implements standard reducer for the iterable;
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
 */
export function reduce<T>(cb: (previousValue: T, currentValue: T, index: number) => T, initialValue?: T): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
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
                        value = cb(value, a.value, index++);
                    }
                    done = true;
                    return {value};
                }
            };
        }
    });
}
