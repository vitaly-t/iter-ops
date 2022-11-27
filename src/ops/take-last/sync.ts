import {$S, SyncOperation} from '../../types';

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
 * @category Operations
 */
export function takeLast<T>(count: number): SyncOperation<T, T> {
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
