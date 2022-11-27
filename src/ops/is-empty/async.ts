import {$A, AsyncOperation} from '../../types';

/**
 * Checks if the iterable is empty, and emits a boolean flag.
 *
 * ```ts
 * import {pipe, isEmpty} from 'iter-ops';
 *
 * const i = pipe(
 *     [],
 *     isEmpty()
 * );
 *
 * console.log(...i); //=> true
 *
 * console.log(i.first); //=> true
 * ```
 *
 * @see
 *  - {@link empty}
 *  - {@link defaultEmpty}
 * @category Operations
 */
export function isEmpty(): AsyncOperation<unknown, boolean> {
    return (iterable) => ({
        [$A](): AsyncIterator<boolean> {
            const i = iterable[$A]();
            let finished = false;
            return {
                next(): Promise<IteratorResult<boolean>> {
                    if (finished) {
                        return Promise.resolve({value: undefined, done: true});
                    }
                    finished = true;
                    return i
                        .next()
                        .then((a) => ({value: !!a.done, done: false}));
                },
            };
        },
    });
}
