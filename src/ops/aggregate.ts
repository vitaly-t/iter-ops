import {Operation} from '../types';

/**
 * Aggregates/accumulates all values into array, passes it into the callback/aggregate,
 * to process the data and return the result.
 *
 * If the callback result is an iterable that you want to emit values,
 * follow it up with the spread operator.
 */
export function aggregate<T, R>(cb: (arr: T[]) => R): Operation<T, R> {
    return null as any;/*
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<R> {
            const i = iterable[Symbol.iterator]();
            let done = false;
            return {
                next(): IteratorResult<R> {
                    if (done) {
                        return {value: undefined, done};
                    }
                    const arr: T[] = [];
                    let a;
                    while (!(a = i.next()).done) {
                        arr.push(a.value);
                    }
                    done = true;
                    return {value: cb(arr)};
                }
            };
        }
    });*/
}
