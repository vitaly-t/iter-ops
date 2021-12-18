import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Standard `Array.some` logic for the iterable, extended for supporting iteration state.
 *
 * It emits a `boolean`, indicating whether at least one element passes the predicate test.
 *
 * ```ts
 * import {pipe, some} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     some(a => a % 2 === 0) // checks if even numbers are present
 * );
 *
 * console.log([...i]); //=> [true]
 *
 * console.log(i.first); //=> true
 * ```
 *
 * @see [Array.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some), [[every]]
 * @category Sync+Async
 */
export function some<T>(cb: (value: T, index: number, state: IterationState) => boolean): Operation<T, boolean> {
    return createOperation(someSync, someAsync, arguments);
}

function someSync<T>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): Iterable<boolean> {
    return {
        [Symbol.iterator](): Iterator<boolean> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0, finished: boolean;
            return {
                next(): IteratorResult<boolean> {
                    if (!finished) {
                        let a;
                        while (!(a = i.next()).done && !cb(a.value, index++, state));
                        finished = true;
                        return {value: !a.done, done: false};
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function someAsync<T>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): AsyncIterable<boolean> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<boolean> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let index = 0, finished: boolean;
            return {
                next(): Promise<IteratorResult<boolean>> {
                    return i.next().then(a => {
                        if (!finished) {
                            if (!a.done) {
                                if (cb(a.value, index++, state)) {
                                    finished = true;
                                    return {value: true, done: false};
                                }
                                return this.next();
                            }
                            finished = true;
                            return {value: false, done: false};
                        }
                        return {value: undefined, done: true};
                    });
                }
            };
        }
    };
}
