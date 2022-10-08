import {$A, $S, IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * **New in v2.0.0**
 *
 * @category Sync+Async
 */
export function flatMap<T, R>(
    cb: (value: T, index: number, state: IterationState) => R
): Operation<T, R>;

export function flatMap(...args: unknown[]) {
    return createOperation(flatMapSync as any, flatMapAsync as any, args);
}

function flatMapSync<T, R>(
    iterable: Iterable<T>,
    cb: (value: T, index: number, state: IterationState) => R
): Iterable<R> {
    return {
        [$S](): Iterator<R> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let spread: any = null;
            let index = 0;
            return {
                next(): IteratorResult<R> {
                    do {
                        if (spread) {
                            const a = spread.next();
                            if (a.done) {
                                spread = null;
                                continue;
                            }
                            return a;
                        }
                        const v = i.next();
                        if (v.done) {
                            return v;
                        }
                        const value: any = cb(v.value, index++, state);
                        spread = value?.[$S]?.();
                        if (!spread) {
                            return {value, done: false};
                        }
                    } while (true);
                },
            };
        },
    };
}

function flatMapAsync<T, R>(
    iterable: AsyncIterable<T>,
    cb: (value: T, index: number, state: IterationState) => R
): AsyncIterable<R> {
    return {
        [$A](): AsyncIterator<R> {
            return {
                next(): Promise<IteratorResult<R>> {
                    // TODO: to be implemented
                    return Promise.resolve({value: undefined, done: true});
                },
            };
        },
    };
}
