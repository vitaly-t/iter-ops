import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Emits up to "count" number of the last values.
 */
export function takeLast<T>(count: number): Operation<T, T> {
    return createOperation(takeLastSync, takeLastAsync, arguments);
}

function takeLastSync<T>(iterable: Iterable<T>, count: number): Iterable<T> {
    return {
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
    };
}

function takeLastAsync<T>(iterable: AsyncIterable<T>, count: number): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const buffer: IteratorResult<T>[] = [];
            let ready = false, done = false, index = 0;
            return {
                async next(): Promise<IteratorResult<T>> {
                    if (!done && count > 0) {
                        if (!ready) {
                            let a;
                            while (!(a = await i.next()).done) {
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
    };
}
