import {Piper} from '../types';

/**
 * Emits unique values, with optional key selector.
 */
export function distinct<T, K>(keySelector?: (value: T, index: number) => K): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const keySet = new Set();
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    let a;
                    do {
                        a = i.next();
                        if (!a.done) {
                            const key = keySelector ? keySelector(a.value, index++) : a.value;
                            if (!keySet.has(key)) {
                                keySet.add(key);
                                return a;
                            }
                        }
                    } while (!a.done);
                    keySet.clear();
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
