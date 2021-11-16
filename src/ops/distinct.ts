import {Piper} from '../types';

/**
 * See here: https://github.com/ReactiveX/rxjs/blob/6fa819beb91ba99dadd6262d6c13f7ddfd9470c5/src/internal/operators/distinct.ts
 */
export function distinct<T, K>(cb?: (value: T) => K): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const keySet = new Set();
            return {
                next(): IteratorResult<T> {
                    let a;
                    do {
                        a = i.next();
                        if (!a.done) {
                            const key = cb ? cb(a.value) : a.value;
                            if (!keySet.has(key)) {
                                keySet.add(key);
                                return a;
                            }
                        }
                    } while (!a.done);
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
