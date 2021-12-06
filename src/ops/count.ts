import {Operation} from '../types';

/**
 * Goes through the entire iterable, counting the values,
 * and produces a one-value iterable with the count.
 */
export function count<T>(): Operation<T, number> {
    return null as any;/*
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<number> {
            let done = false;
            return {
                next(): IteratorResult<number> {
                    let value;
                    if (done) {
                        return {value, done};
                    }
                    const i = iterable[Symbol.iterator]();
                    value = 0;
                    while (!i.next().done) {
                        value++;
                    }
                    done = true;
                    return {value};
                }
            };
        }
    });*/
}
