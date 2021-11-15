import {Piper} from '../types';

/**
 * Implements standard map processor for the iterable;
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
 */
export function map<T, R>(cb: (value: T, index: number) => R): Piper<T, R> {
    return (iterator: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<R> {
            const i = iterator[Symbol.iterator]();
            let index = 0;
            return {
                next(): IteratorResult<R> {
                    let a;
                    do {
                        a = i.next();
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
