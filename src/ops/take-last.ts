import {Piper} from '../types';

/**
 * Emits up to "count" number of the last values.
 */
export function takeLast<T>(count: number): Piper<T, T> {
    return (iterable: Iterable<T>) => ({
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const buffer: IteratorResult<T>[] = [];
            let ready = false, done = false, index = 0;
            return {
                next(): IteratorResult<T> {
                    if (!done && count > 0) {
                        if (!ready) {
                            let a;
                            while (!(a = i.next()).done) {
                                buffer.push(a);
                                if (count < buffer.length) {
                                    buffer.shift();
                                }
                            }
                            ready = true;
                        }
                        if (index < buffer.length) {
                            return buffer[index++];
                        }
                        done = true;
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    });
}
