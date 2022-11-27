import {$A, $S, AsyncOperation} from '../../types';

/**
 * Spreads / expands iterable values.
 *
 * The source is expected to emit iterable values only, or else it will throw an error.
 *
 * ```ts
 * import {pipe, spread} from 'iter-ops';
 *
 * const i = pipe(
 *     ['first', 'second'],
 *     spread()
 * );
 *
 * console.log(...i); //=> 'f', 'i', 'r', 's', 't', 's', 'e', 'c', 'o', 'n', 'd'
 * ```
 *
 * It implements the logic consistent with JavaScript's native spread operator, whereby it expands
 * elements on the top level only, and it will throw an error when passed in a non-iterable value.
 *
 * If you want values expanded recursively, and without throwing errors, see operator {@link flat}.
 *
 * @throws `TypeError: 'Value at index X is not iterable: ...'` when a non-iterable value encountered.
 *
 * @see
 *  - {@link flat}
 * @category Operations
 */
export function spread<
    T extends Iterable<unknown> | AsyncIterable<unknown>
>(): AsyncOperation<
    T,
    T extends Iterable<infer E> | AsyncIterable<infer E> ? E : never
> {
    type X = T extends Iterable<infer E> | AsyncIterable<infer E> ? E : never;
    return (iterable) => ({
        [$A](): AsyncIterator<X> {
            const i = iterable[$A]();
            let k: any,
                start = true,
                index = 0,
                sync: boolean;
            return {
                next(): Promise<IteratorResult<X>> {
                    const nextValue = (
                        wrap: boolean
                    ): Promise<IteratorResult<X>> => {
                        const out = (v: IteratorResult<X>) => {
                            if (!v.done) {
                                return sync && wrap ? Promise.resolve(v) : v;
                            }
                            start = true;
                            return this.next();
                        };
                        const r = k.next();
                        return sync ? out(r) : r.then(out);
                    };
                    if (start) {
                        start = false;
                        return i.next().then((a: IteratorResult<any>) => {
                            if (a.done) {
                                return a;
                            }
                            sync = true;
                            k = a.value?.[$S]?.();
                            if (!k) {
                                sync = false;
                                k = a.value?.[$A]?.();
                            }
                            if (!k) {
                                throw new TypeError(
                                    `Value at index ${index} is not iterable: ${JSON.stringify(
                                        a.value
                                    )}`
                                );
                            }
                            index++;
                            return nextValue(false);
                        });
                    }
                    return nextValue(true);
                },
            };
        },
    });
}
