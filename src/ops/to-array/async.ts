import {$A, AsyncOperation} from '../../types';

/**
 * Accumulates all values and emits an array.
 *
 * ```ts
 * import {pipe, toArray} from 'iter-ops';
 *
 * const i = pipe([1, 2, 3], toArray());
 *
 * console.log(i.first); //=> [1, 2, 3]
 * ```
 *
 * @see
 *  - {@link aggregate}
 *  - {@link spread}
 *  - {@link flat}
 *
 * @category Operations
 */
export function toArray<T>(): AsyncOperation<T, T[]> {
    return (iterable) => ({
        [$A](): AsyncIterator<T[]> {
            const i = iterable[$A]();
            const value: T[] = [];
            let finished = false;
            return {
                next(): Promise<IteratorResult<T[]>> {
                    return i.next().then((a) => {
                        if (a.done) {
                            if (finished) {
                                return a;
                            }
                            finished = true;
                            return {value, done: false};
                        }
                        value.push(a.value);
                        return this.next();
                    });
                },
            };
        },
    });
}
