import {Piper} from '../types';

/**
 * Catches iteration errors, to either re-throw or return a new value of the same type.
 *
 * Callback parameters:
 *
 *  - error: the error that was thrown
 *  - index: index of the value that we failed to retrieve
 *  - lastValue: last successful value, if any, or else undefined
 */
export function catchError<T>(cb: (error: any, index: number, lastValue?: T) => never): Piper<T, T>;
export function catchError<T>(cb: (error: any, index: number, lastValue?: T) => T): Piper<T, T>;

export function catchError<T>(cb: (error: any, index: number, lastValue?: T) => T): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let index = 0, last: IteratorResult<T>;
            return {
                next(): IteratorResult<T> {
                    try {
                        last = i.next();
                    } catch (e) {
                        return {value: cb(e, index++, last?.value)};
                    }
                    index++;
                    return last;
                }
            };
        }
    });
}
