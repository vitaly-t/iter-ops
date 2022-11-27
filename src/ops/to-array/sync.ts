import {$S, SyncOperation} from '../../types';

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
export function toArray<T>(): SyncOperation<T, T[]> {
    return (iterable) => ({
        [$S](): Iterator<T[]> {
            const i = iterable[$S]();
            let done = false;
            return {
                next(): IteratorResult<T[]> {
                    if (done) {
                        return {value: undefined, done};
                    }
                    const arr = [];
                    let a;
                    while (!(a = i.next()).done) {
                        arr.push(a.value);
                    }
                    done = true;
                    return {value: arr, done: false};
                },
            };
        },
    });
}
