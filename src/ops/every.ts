import {$A, $S, AsyncOperation, IterationState, Operation} from '../types';
import {isPromiseLike} from '../typeguards';
import {createOperation} from '../utils';

/**
 * Standard `Array.every` logic for the iterable, extended with iteration state + async.
 *
 * It emits a `boolean`, indicating whether all elements pass the predicate test.
 *
 * ```ts
 * import {pipe, every} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     every(a => a % 2 === 0) // checks if every number is even
 * );
 *
 * console.log(...i); //=> false
 *
 * console.log(i.first); //=> false
 * ```
 *
 * @see
 *  - [Array.every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
 *  - {@link some}
 * @category Sync+Async
 */
export function every<T>(
    cb: (value: T, index: number, state: IterationState) => boolean
): Operation<T, boolean>;

/**
 * Standard `Array.every` logic for the iterable, extended with iteration state + async.
 *
 * It emits a `boolean`, indicating whether all elements pass the predicate test.
 *
 * ```ts
 * import {pipe, every} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     every(a => a % 2 === 0) // checks if every number is even
 * );
 *
 * console.log(...i); //=> false
 *
 * console.log(i.first); //=> false
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline.
 *
 * @see
 *  - [Array.every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
 *  - {@link some}
 * @category Sync+Async
 */
export function every<T>(
    cb: (value: T, index: number, state: IterationState) => Promise<boolean>
): AsyncOperation<T, boolean>;

export function every(...args: unknown[]) {
    return createOperation(everySync, everyAsync, args);
}

function everySync<T>(
    iterable: Iterable<T>,
    cb: (value: T, index: number, state: IterationState) => boolean
): Iterable<boolean> {
    return {
        [$S](): Iterator<boolean> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0,
                finished: boolean;
            return {
                next(): IteratorResult<boolean> {
                    if (!finished) {
                        let a;
                        while (
                            !(a = i.next()).done &&
                            cb(a.value, index++, state)
                        );
                        finished = true;
                        return {value: !!a.done, done: false};
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    };
}

function everyAsync<T>(
    iterable: AsyncIterable<T>,
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): AsyncIterable<boolean> {
    return {
        [$A](): AsyncIterator<boolean> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = 0,
                finished: boolean;
            return {
                next(): Promise<IteratorResult<boolean>> {
                    if (finished) {
                        return Promise.resolve({value: undefined, done: true});
                    }
                    return i.next().then((a) => {
                        const r = (a.done ||
                            cb(a.value, index++, state)) as Promise<boolean>;
                        const out = (flag: any) => {
                            finished = a.done || !flag;
                            return finished
                                ? {value: !!a.done, done: false}
                                : this.next();
                        };
                        return isPromiseLike(r) ? r.then(out) : out(r);
                    });
                },
            };
        },
    };
}
