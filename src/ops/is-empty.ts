import {$A, $S, Operation} from '../types';
import {createOperation} from '../utils';

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
 * @category Sync+Async
 */
export function isEmpty<T>(): Operation<T, boolean>;

export function isEmpty(...args: unknown[]) {
    return createOperation(isEmptySync, isEmptyAsync, args);
}

function isEmptySync<T>(iterable: Iterable<T>): Iterable<boolean> {
    return {
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
    };
}

function isEmptyAsync<T>(iterable: AsyncIterable<T>): AsyncIterable<boolean> {
    return {
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
    };
}
