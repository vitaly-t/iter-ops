import {isPromiseLike} from '../../typeguards';
import {$A, AsyncOperation, IterationState} from '../../types';

/**
 * Standard reducer for the iterable, extended for fully async syntax + iteration state.
 *
 * Below is an example of calculating the average from a sequence of numbers:
 *
 * ```ts
 * import {pipe, reduce} from 'iter-ops';
 *
 * const input = [3, 0, -2, 5, 9, 4];
 *
 * const i = pipe(input, reduce((p, c, idx, state) => {
 *     state.sum = (state.sum ?? p) + c;
 *     return p && state.sum / (idx + 1);
 * }));
 *
 * console.log(...i); //=> 3.1666(6)
 * ```
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce Array.reduce}
 * @category Operations
 */
export function reduce<T>(
    reducer: (
        previousValue: T,
        currentValue: T,
        index: number,
        state: IterationState
    ) => T | Promise<T>
): AsyncOperation<T, T>;

export function reduce<T, R>(
    reducer: (
        previousValue: R,
        currentValue: T,
        index: number,
        state: IterationState
    ) => R | Promise<R>,
    initialValue: R | Promise<R>
): AsyncOperation<T, R>;

export function reduce<T, R = T>(
    ...args:
        | [
              reducer: (
                  previousValue: R,
                  currentValue: T,
                  index: number,
                  state: IterationState
              ) => T
          ]
        | [
              reducer: (
                  previousValue: R,
                  currentValue: T,
                  index: number,
                  state: IterationState
              ) => R | Promise<R>,
              initialValue: R | Promise<R>
          ]
): AsyncOperation<T, R> {
    return (iterable) => ({
        [$A](): AsyncIterator<R> {
            const i = iterable[$A]();
            const state: IterationState = {};
            const hasInitialValue = args.length === 2;
            const [reducer] = args;
            let [, accumulator] = args;
            let finished = false;
            let index = 0;

            const next = () => {
                return i
                    .next()
                    .then(
                        (a): IteratorResult<R> | Promise<IteratorResult<R>> => {
                            if (a.done) {
                                if (finished) {
                                    return a;
                                }
                                finished = true;
                                return {value: accumulator as R, done: false};
                            }
                            if (index === 0 && !hasInitialValue) {
                                accumulator = a.value as unknown as R;
                                index++;
                                return next();
                            }

                            const v = reducer(
                                accumulator as R,
                                a.value,
                                index++,
                                state
                            );
                            if (isPromiseLike<typeof v, R>(v)) {
                                return (v as Promise<R>).then((val) => {
                                    accumulator = val;
                                    return next();
                                });
                            }
                            accumulator = v as R;
                            return next();
                        }
                    );
            };

            if (isPromiseLike<typeof accumulator, R>(accumulator)) {
                return {
                    next: () =>
                        (accumulator as Promise<R>).then((initialValue) => {
                            accumulator = initialValue;
                            return next();
                        }) as Promise<IteratorResult<R>>,
                };
            }

            return {
                next,
            };
        },
    });
}
