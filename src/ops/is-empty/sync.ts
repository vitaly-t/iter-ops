import {$S, SyncOperation} from '../../types';

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
export function isEmpty(): SyncOperation<unknown, boolean> {
    return (iterable) => ({
        [$S](): Iterator<boolean> {
            const i = iterable[$S]();
            let finished = false;
            return {
                next(): IteratorResult<boolean> {
                    if (!finished) {
                        const a = i.next();
                        finished = true;
                        return {value: !!a.done, done: false};
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    });
}
