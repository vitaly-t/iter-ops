import {Piper} from '../types';

/**
 * Implements standard filter processor for the iterable;
 * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */
export function filter<T>(cb: (value: T, index: number) => boolean): Piper<T, T> {
    return (iterator: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            let index = 0, t = iterator[Symbol.iterator]();
            return {
                next(): IteratorResult<T> {
                    let a;
                    do {
                        a = t.next();
                        if (!a.done && cb(a.value, index++)) {
                            return a;
                        }
                    } while (!a.done);
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
