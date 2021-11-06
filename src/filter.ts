import {Piper} from './common';

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
                            return {value: a.value};
                        }
                    } while (!a.done);
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
