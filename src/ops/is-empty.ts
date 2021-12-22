import {Operation} from '../types';
import {createOperation} from '../shared';

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
 * @see [[empty]], [[defaultEmpty]]
 * @category Sync+Async
 */
export function isEmpty<T>(): Operation<T, boolean> {
    return createOperation(isEmptySync, isEmptyAsync);
}

function isEmptySync<T>(iterable: Iterable<T>): Iterable<boolean> {
    return {
        [Symbol.iterator](): Iterator<boolean> {
            const i = iterable[Symbol.iterator]();
            let finished = false;
            return {
                next(): IteratorResult<boolean> {
                    if (!finished) {
                        const a = i.next();
                        finished = true;
                        return {value: !!a.done, done: false};
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function isEmptyAsync<T>(iterable: AsyncIterable<T>): AsyncIterable<boolean> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<boolean> {
            const i = iterable[Symbol.asyncIterator]();
            let finished = false;
            return {
                next(): Promise<IteratorResult<boolean>> {
                    if (finished) {
                        return Promise.resolve({value: undefined, done: true});
                    }
                    finished = true;
                    return i.next().then(a => ({value: !!a.done, done: false}));
                }
            };
        }
    };
}
