import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Standard `Array.every` logic for the iterable, extended for supporting iteration state.
 *
 * It emits a boolean, indicating whether all elements pass the predicate test.
 *
 * ```ts
 * import {pipe, every} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     every(a => a % 2 === 0) // checks if every number is even
 * );
 *
 * console.log([...i]); //=> [false]
 *
 * console.log(i.first); //=> false
 * ```
 *
 * @see [Array.every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
 * @category Sync+Async
 */
export function every<T>(cb: (value: T, index: number, state: IterationState) => boolean): Operation<T, boolean> {
    return createOperation(everySync, everyAsync, arguments);
}

function everySync<T>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): Iterable<boolean> {
    return {
        [Symbol.iterator](): Iterator<boolean> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0, finished: boolean;
            return {
                next(): IteratorResult<boolean> {
                    if (!finished) {
                        let a;
                        while (!(a = i.next()).done && cb(a.value, index++, state));
                        finished = true;
                        return {value: !!a.done, done: false};
                    }
                    return {value: undefined, done: true};
                }
            };
        }
    };
}

function everyAsync<T>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): AsyncIterable<boolean> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<boolean> {
            const i = iterable[Symbol.asyncIterator]();
            //const state: IterationState = {};
            //let index = 0, finished: boolean;
            return {
                next(): Promise<IteratorResult<boolean>> {
                    return i.next().then(a => {
                        return {value: false};
                    });
                }
            };
        }
    };
}
