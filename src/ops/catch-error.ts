import {Piper} from '../types';

/**
 * Catches iteration errors, to either re-throw or return a new value.
 */
export function catchError<T>(cb: (error: any, index: number, lastValue: T) => any): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            // const i = iterable[Symbol.iterator]();
            // let index = 0;
            return {
                next(): IteratorResult<T> {
                    // TODO: to be implemented
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
