import {Any, Piper} from '../types';

/**
 * Catches iteration errors, to either re-throw or return a new value|iterator|iterable.
 */
export function catchError<T>(cb: (error: any, index: number, lastValue?: T) => never): Piper<T, never>;
export function catchError<T>(cb: (error: any, index: number, lastValue?: T) => Any<T>): Piper<T, T>;

export function catchError<T>(cb: (error: any, index: number, lastValue?: T) => Any<T> | never): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0, last: T;
            // TODO: this is all work in progress!
            return {
                next(): IteratorResult<T> {
                    let a;
                    try {
                        a = i.next();
                        last = a.value;
                    } catch (e) {
                        const r = cb(e, index, last) as T;
                        return {value: r};
                    }
                    index++;
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
