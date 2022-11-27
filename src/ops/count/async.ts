import {$A, AsyncOperation, IterationState} from '../../types';
import {isPromiseLike} from '../../typeguards';

/**
 * Goes through the entire iterable, counting the values, and produces a one-value iterable with the count.
 *
 * ```ts
 * import {pipe, count} from 'iter-ops';
 *
 * const i = pipe(
 *     'hello world!',
 *     count()
 * );
 *
 * console.log(...i); //=> 12
 *
 * console.log(i.first); //=> 12
 * ```
 *
 * When the optional predicate is specified, only values that satisfy the predicate are counted.
 *
 * ```ts
 * import {pipe, count} from 'iter-ops';
 *
 * const i = pipe(
 *     'hello world!',
 *     count(a => a === 'l')
 * );
 *
 * console.log(...i); //=> 3
 *
 * console.log(i.first); //=> 3
 * ```
 *
 * @category Operations
 */
export function count<T>(
    cb?: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): AsyncOperation<T, number> {
    return (iterable) => ({
        [$A](): AsyncIterator<number> {
            const i = iterable[$A]();
            const test = typeof cb === 'function' && cb;
            const state: IterationState = {};
            let value = 0,
                index = 0,
                finished = false;
            return {
                next(): Promise<IteratorResult<number>> {
                    return i.next().then((a) => {
                        if (a.done) {
                            if (finished) {
                                return a;
                            }
                            finished = true;
                            return {value, done: false};
                        }
                        const r: any = !test || test(a.value, index++, state);
                        const out = (flag: any) => {
                            value += flag ? 1 : 0;
                            return this.next();
                        };
                        return isPromiseLike(r) ? r.then(out) : out(r);
                    });
                },
            };
        },
    });
}
