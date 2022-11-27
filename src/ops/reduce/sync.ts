import {$S, IterationState, SyncOperation} from '../../types';

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
    ) => T
): SyncOperation<T, T>;

export function reduce<T, R>(
    reducer: (
        previousValue: R,
        currentValue: T,
        index: number,
        state: IterationState
    ) => R,
    initialValue: R
): SyncOperation<T, R>;

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
              ) => R,
              initialValue: R
          ]
): SyncOperation<T, R> {
    return (iterable) => ({
        [$S](): Iterator<R> {
            const i = iterable[$S]();
            const state: IterationState = {};
            const hasInitialValue = args.length === 2;
            const [reducer] = args;
            let [, accumulator] = args;
            let done = false;
            let index = 0;
            return {
                next(): IteratorResult<R> {
                    if (done) {
                        return {value: undefined, done};
                    }
                    let a;
                    while (!(a = i.next()).done) {
                        if (index === 0 && !hasInitialValue) {
                            accumulator = a.value as unknown as R;
                            index++;
                        } else {
                            accumulator = reducer(
                                accumulator!,
                                a.value,
                                index++,
                                state
                            ) as R;
                        }
                    }

                    if (index === 0 && !hasInitialValue) {
                        throw new TypeError(
                            'Reduce of empty source with no initial value'
                        );
                    }

                    done = true;
                    return {value: accumulator!, done: false};
                },
            };
        },
    });
}
