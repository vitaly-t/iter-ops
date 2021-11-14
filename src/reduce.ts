import {Piper} from './common';

export function reduce<T>(cb: (previousValue: T, currentValue: T, index: number) => T, initialValue?: T): Piper<T, T> {
    return (iterator: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            let value = initialValue as T, done = false;
            return {
                next(): IteratorResult<T> {
                    if (!done) {
                        let index = 0;
                        for (const curr of iterator) {
                            if (!index++ && value === undefined) {
                                value = curr;
                                continue;
                            }
                            value = cb(value, curr, index++);
                        }
                        done = true;
                        return {value};
                    }
                    return {value, done}
                }
            };
        }
    });
}
