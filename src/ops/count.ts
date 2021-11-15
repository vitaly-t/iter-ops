import {Piper} from '../types';

/**
 * Goes through the entire iterable, counting the values,
 * and produces a one-value iterable with the count.
 */
export function count<T>(): Piper<T, number> {
    return (iterator: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<number> {
            let done = false;
            return {
                next(): IteratorResult<number> {
                    let value;
                    if (done) {
                        return {value, done};
                    }
                    const i = iterator[Symbol.iterator]();
                    value = 0;
                    while (!i.next().done) {
                        value++;
                    }
                    done = true;
                    return {value};
                }
            };
        }
    });
}
