import {Piper} from '../types';

/**
 * Emits up to "count" number of the last values.
 */
export function takeLast<T>(count: number): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            // const i = iterable[Symbol.iterator]();
            // let index = 0, done = false;
            return {
                next(): IteratorResult<T> {
                    // TODO: to be implemented

                    /*
                    a) allocate buffer size = count; (or use dynamic one)
                    b) deplete the source, while shifting everything in the buffer once it is full
                    c) start emitting values from the buffer

                    NOTE: check how RXJS does it first!
                    */
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
