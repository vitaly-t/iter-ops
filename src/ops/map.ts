import {Piper} from '../types';

/**
 * Implements standard map processor for the iterable;
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 */
export function map<T, R>(cb: (value: T, index: number) => R): Piper<T, R> {
    return (iterator: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<R> {
            let index = 0, t = iterator[Symbol.iterator]()
            return {
                next(): IteratorResult<R> {
                    let a;
                    do {
                        a = t.next();
                        if (!a.done) {
                            return {value: cb(a.value, index++)};
                        }
                    } while (!a.done);
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
