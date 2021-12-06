import {Operation} from '../types';

/**
 * Accumulates all values and emits an array.
 */
export function toArray<T>(): Operation<T, T[]> {
    return null as any;/*
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T[]> {
            const i = iterable[Symbol.iterator]();
            let done = false;
            return {
                next(): IteratorResult<T[]> {
                    if (done) {
                        return {value: undefined, done};
                    }
                    const arr = [];
                    let a;
                    while (!(a = i.next()).done) {
                        arr.push(a.value);
                    }
                    done = true;
                    return {value: arr};
                }
            };
        }
    });*/
}
