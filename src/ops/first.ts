import {Operation} from '../types';
import {createOperation, isPromise} from '../utils';

/**
 * Produces a one-value iterable, with the first emitted value.
 *
 * Without the optional predicate, it is the same as `take(1)`.
 *
 * ```ts
 * import {pipe, first} from 'iter-ops';
 *
 * const i = pipe(
 *     [10, 20, 30],
 *     first()
 * );
 *
 * console.log(...i); //=> 10
 *
 * console.log(i.first); //=> 10
 * ```
 *
 * When the optional predicate is provided, the first value satisfying it will be emitted.
 *
 * ```ts
 * import {pipe, first} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     first(a => a % 2 === 0) // first even number
 * );
 *
 * console.log(...i); //=> 2
 * ```
 *
 * Note that the predicate can only return a `Promise` inside asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see [[last]], [[take]], [[takeLast]]
 * @category Sync+Async
 */
export function first<T>(cb?: (value: T, index: number) => boolean | Promise<boolean>): Operation<T, T> {
    return createOperation(firstSync, firstAsync, arguments);
}

function firstSync<T>(iterable: Iterable<T>, cb?: (value: T, index: number) => boolean): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const test = typeof cb === 'function' && cb;
            let index = 0, finished: boolean;
            return {
                next(): IteratorResult<T> {
                    if (finished) {
                        return {value: undefined, done: true};
                    }
                    let a;
                    while (!(a = i.next()).done && test && !test(a.value, index++));
                    finished = true;
                    return a;
                }
            };
        }
    };
}

function firstAsync<T>(iterable: AsyncIterable<T>, cb?: (value: T, index: number) => boolean | Promise<boolean>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const test = typeof cb === 'function' && cb;
            let index = 0, finished = false;
            return {
                next(): Promise<IteratorResult<T>> {
                    if (finished) {
                        return Promise.resolve({value: undefined, done: true});
                    }
                    return i.next().then(a => {
                        const r = (a.done || !test || test(a.value, index++)) as Promise<boolean>;
                        const out = (flag: any) => {
                            finished = flag;
                            return finished ? a : this.next();
                        };
                        return isPromise(r) ? r.then(out) : out(r);
                    });
                }
            };
        }
    };
}
