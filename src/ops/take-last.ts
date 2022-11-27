import {$A, $S, AsyncOperation, DuelOperation, SyncOperation} from '../types';
import {createDuelOperation} from '../utils';

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
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 *
 * @category Sync+Async
 */
export function takeLast<T>(count: number): DuelOperation<T, T> {
    return createDuelOperation<T, T>(takeLastSync, takeLastAsync, [count]);
}

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
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 * @category Operations
 */
export function takeLastSync<T>(count: number): SyncOperation<T, T> {
    return (iterable) => ({
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
    });
}

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
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 * @category Operations
 */
export function takeLastAsync<T>(count: number): AsyncOperation<T, T> {
    return (iterable) => ({
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
    });
}
