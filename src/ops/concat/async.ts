import {$A, Value, AsyncOperation} from '../../types';
import {isPromiseLike} from '../../typeguards';

/**
 * Merges current iterable with any combination of values, iterators or iterables.
 * Merged inputs are iterated over after depleting the current iterable, in the order in which they were specified,
 * i.e. the standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat Array.concat} logic.
 *
 * ```ts
 * import {pipe, concat} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2],
 *     concat(3, 4, [5, 6])
 * );
 *
 * console.log(...i); //=> 1 2 3 4 5 6
 * ```
 *
 * Note that if you concatenate asynchronous iterables inside a synchronous pipeline, they will be processed as simple values.
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat Array.concat}
 * @category Operations
 */
export function concat<T, Vs extends readonly unknown[]>(
    ...values: Value<T>[]
): AsyncOperation<
    T,
    | T
    | (Vs[number] extends
          | Iterable<infer U>
          | Iterator<infer U>
          | AsyncIterable<infer U>
          | AsyncIterator<infer U>
          ? U
          : never)
> {
    return (iterable) => ({
        [$A](): AsyncIterator<T> {
            let v: any = iterable[$A](); // current value or iterator
            let index = -1, // current "values" index
                start = false; // set when need to step forward
            return {
                next() {
                    if (start) {
                        if (++index === values.length) {
                            return Promise.resolve({
                                value: undefined,
                                done: true,
                            });
                        }
                        v = values[index];
                        const k =
                            typeof v?.next === 'function'
                                ? v
                                : v?.[Symbol.iterator]?.() ||
                                  v?.[Symbol.asyncIterator]?.();
                        start = !k;
                        if (start) {
                            return Promise.resolve({value: v, done: false});
                        }
                        v = k;
                    }
                    const a = v.next();
                    const out = (b: any) => {
                        if (b.done) {
                            start = true;
                            return this.next();
                        }
                        return b;
                    };
                    return isPromiseLike(a)
                        ? a.then(out)
                        : Promise.resolve(out(a));
                },
            };
        },
    });
}
