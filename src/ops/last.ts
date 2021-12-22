import {Operation} from '../types';
import {createOperation} from '../shared';
import {isPromise} from '../utils';

/**
 * Produces a one-value iterable, with the last emitted value.
 *
 * ```ts
 * import {pipe, last} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3],
 *     last()
 * );
 *
 * console.log(...i); //=> 3
 *
 * console.log(i.first); //=> 3
 * ```
 *
 * When the optional predicate is provided, the last value satisfying it will be emitted.
 *
 * ```ts
 * import {pipe, last} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     last(a => a % 2 === 0) // last even number
 * );
 *
 * console.log(i.first); //=> 8
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see [[takeLast]], [[first]]
 * @category Sync+Async
 */
export function last<T>(cb?: (value: T, index: number) => boolean | Promise<boolean>): Operation<T, T> {
    return createOperation(lastSync, lastAsync, arguments);
}

function lastSync<T>(iterable: Iterable<T>, cb?: (value: T, index: number) => boolean): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const test = typeof cb === 'function' && cb;
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    let a, r;
                    while (!(a = i.next()).done) {
                        if (!test || test(a.value, index++)) {
                            r = a;
                        }
                    }
                    return r ? {value: r.value, done: false} : a;
                }
            };
        }
    };
}

function lastAsync<T>(iterable: AsyncIterable<T>, cb?: (value: T, index: number) => boolean | Promise<boolean>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const test = typeof cb === 'function' && cb;
            let finished = false, index = 0, value: IteratorResult<T>;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => {
                        if (finished) {
                            return {value: undefined, done: true};
                        }
                        const r = (a.done || !test || test(a.value, index++)) as Promise<boolean>;
                        const out = (flag: any) => {
                            finished = !!a.done;
                            value = flag && !a.done ? a : value || a;
                            return finished ? value : this.next();
                        };
                        return isPromise(r) ? r.then(out) : out(r);
                    });
                }
            };
        }
    };
}
