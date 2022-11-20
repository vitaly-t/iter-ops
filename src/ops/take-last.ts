import {$A, $S, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Emits up to `count` number of the last values.
 *
 * ```ts
 * import {pipe, takeLast} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     takeLast(2)
 * );
 *
 * console.log(...i); //=> 4, 5
 * ```
 *
 * @see
 *  - {@link last}
 *  - {@link take}
 *
 * @category Sync+Async
 */
export function takeLast<T>(count: number): Operation<T, T>;

export function takeLast(...args: unknown[]) {
    return createOperation(takeLastSync, takeLastAsync, args);
}

function takeLastSync<T>(iterable: Iterable<T>, count: number): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const buffer: IteratorResult<T>[] = [];
            let ready = false,
                done = false,
                index = 0;
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
                },
            };
        },
    };
}

function takeLastAsync<T>(
    iterable: AsyncIterable<T>,
    count: number
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const buffer: IteratorResult<T>[] = [];
            let done = false,
                index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (!done && count > 0) {
                            if (!a.done) {
                                buffer.push(a);
                                if (count < buffer.length) {
                                    buffer.shift();
                                }
                                return this.next();
                            }
                            if (index < buffer.length) {
                                return buffer[index++];
                            }
                            done = true;
                        }
                        return {value: undefined, done: true};
                    });
                },
            };
        },
    };
}
