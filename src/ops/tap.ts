import {$A, $S, IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Taps into each value, without changing the output, for logging or debugging.
 *
 * ```ts
 * import {pipe, tap} from 'iter-ops';
 *
 * const i = pipe(
 *     'text',
 *     tap(a => {
 *         console.log(a); //=> t e x t
 *     })
 * ); //=> IterableExt<string>
 *
 * const result = [...i]; // t e x t
 * ```
 *
 * @category Sync+Async
 */
export function tap<T>(
    cb: (value: T, index: number, state: IterationState) => void,
): Operation<T, T>;

export function tap(...args: unknown[]) {
    return createOperation(tapSync, tapAsync, args);
}

function tapSync<T>(
    iterable: Iterable<T>,
    cb: (value: T, index: number, state: IterationState) => void,
): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    const a = i.next();
                    if (!a.done) {
                        cb(a.value, index++, state);
                    }
                    return a;
                },
            };
        },
    };
}

function tapAsync<T>(
    iterable: AsyncIterable<T>,
    cb: (value: T, index: number, state: IterationState) => void,
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (!a.done) {
                            cb(a.value, index++, state);
                        }
                        return a;
                    });
                },
            };
        },
    };
}
