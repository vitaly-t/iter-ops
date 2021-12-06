import {Operation} from '../types';

/**
 * Emits up to "count" number of values.
 */
export function take<T>(count: number): Operation<T, T> {
    return null as any;/*
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0, done = false;
            return {
                next(): IteratorResult<T> {
                    if (!done) {
                        const a = i.next();
                        if (a.done || index++ >= count) {
                            done = true;
                        } else {
                            return a;
                        }
                    }
                    return {value: undefined, done};
                }
            };
        }
    });*/
}
