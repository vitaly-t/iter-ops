import {Terminator} from './common';

export function toArray<T>(): Terminator<T, T[]> {
    return () => ({
        process(iterator: Iterable<T>) {
            const res: T[] = [];
            for (const a of iterator) {
                res.push(a);
            }
            return res;
        }
    })
}
