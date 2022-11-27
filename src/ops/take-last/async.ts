import {$A, AsyncOperation} from '../../types';

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
export function takeLast<T>(count: number): AsyncOperation<T, T> {
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
