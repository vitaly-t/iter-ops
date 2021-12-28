import {$A, $S, IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Value index details, during [[split]] operation.
 */
export interface ISplitIndex {
    /**
     * Start Index - absolute value index, from the start of the iterable.
     */
    start: number;

    /**
     * List Index - relative to the current list.
     * Index of the value within the currently accumulated list.
     *
     * Note that when `split` or `toggle-OFF` values are carried forward,
     * it starts with 1, as 0 refers to the value that was carried forward.
     */
    list: number;

    /**
     * Split Index - of resulting emits by the operator, starts with 0,
     * and incremented every time the operator emits data.
     */
    split: number;
}

/**
 * Set of options that can be passed into [[split]] operator.
 */
export interface ISplitOptions {
    /**
     * Strategy for carrying every `toggle-ON` value.
     * It is used only when in `toggle` mode.
     */
    carryStart?: SplitValueCarry;

    /**
     * Strategy for carrying every `toggle-OFF` or `split` value.
     */
    carryEnd?: SplitValueCarry;

    /**
     * Changes what the `split` callback result represents.
     * By default, it signals when we find a split value.
     *
     * This option changes that into a `toggle` logic:
     *
     * We start collecting values into a new list when the callback returns true
     * one time, and we stop collecting values when it returns true the next time.
     * And we do so repeatedly, skipping values outside `[true, ..., true]` toggles.
     */
    toggle?: boolean;
}

/**
 * Strategy for carrying over split/toggle values.
 * It defines what to do with each value that triggers the split/toggle.
 *
 * Note that [[split]] operator treats this enum in non-strict manner:
 *  - any negative number is treated as `back`
 *  - any positive number is treated as `forward`
 *  - everything else is treated as `none`
 */
export enum SplitValueCarry {
    /**
     * Split/toggle value is carried back, to be the last value in the current list.
     */
    back = -1,

    /**
     * Split/toggle value is just a placeholder/gap, to be skipped.
     * This is the default.
     */
    none = 0,

    /**
     * Split/toggle value is carried forward, to make the first value in the next list.
     */
    forward = 1,
}

/**
 * Splits values into separate lists when predicate returns `true` (or resolves with `true`).
 * When option `toggle` is set, the split uses the toggle start/end logic.
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * When you know only the split value of each block, you can use the default split mode,
 * with `carryEnd` set to `1/forward` (in case you do not want it skipped);
 *
 * When you know only the end value of each block, you can use the default split mode,
 * with `carryEnd` set to `-1/back` (in case you do not want it skipped);
 *
 * When you know both start and end values of each block, you can use the `toggle` mode,
 * with `carryStart` set to `1/forward`, and `carryEnd` set to `-1/back`, unless you want
 * either of those skipped, then leave them at `0/none`.
 *
 * Note that in `toggle` mode, you cannot use `carryStart=back` (it will be ignored),
 * because it would delay emission of the current block indefinitely, plus carrying
 * block start backward doesn't make much sense anyway.
 *
 * @see [[https://github.com/vitaly-t/iter-ops/wiki/Split Split WiKi]], [[page]]
 * @category Sync+Async
 */
export function split<T>(
    cb: (
        value: T,
        index: ISplitIndex,
        state: IterationState
    ) => boolean | Promise<boolean>,
    options?: ISplitOptions
): Operation<T, T[]>;

export function split(...args: unknown[]) {
    return createOperation(splitSync, splitAsync, args);
}

function splitSync<T>(
    iterable: Iterable<T>,
    cb: (value: T, index: ISplitIndex, state: IterationState) => boolean,
    options?: ISplitOptions
): Iterable<T[]> {
    return {
        [$S](): Iterator<T[]> {
            const i = iterable[$S]();
            const state: IterationState = {};

            // quick access to the options:
            const carryStart = options?.carryStart
                ? options?.carryStart < 0
                    ? -1
                    : options?.carryStart > 0
                    ? 1
                    : 0
                : 0;
            const carryEnd = options?.carryEnd
                ? options?.carryEnd < 0
                    ? -1
                    : options?.carryEnd > 0
                    ? 1
                    : 0
                : 0;
            const toggle = !!options?.toggle;

            // all indexes:
            let startIndex = 0;
            let listIndex = 0;
            let splitIndex = 0;

            let collecting = !toggle; // indicates when we are collecting values
            let finished = false; // indicates when we are all done

            let prev: IteratorResult<T> | null; // previous value when carrying forward

            return {
                next(): IteratorResult<T[]> {
                    const list: T[] = [];
                    let v: IteratorResult<T>; // next value object
                    do {
                        if (prev) {
                            // previous trigger value is being moved forward;
                            list.push(prev.value);
                            prev = null;
                        }
                        v = i.next();
                        if (!v.done) {
                            const index: ISplitIndex = {
                                start: startIndex++,
                                list: listIndex,
                                split: splitIndex,
                            };
                            if (cb(v.value, index, state)) {
                                // split/toggle has been triggered;
                                const carry = collecting
                                    ? carryEnd
                                    : carryStart;
                                if (carry) {
                                    if (carry < 0) {
                                        list.push(v.value);
                                    } else {
                                        prev = v; // carry "forward", save for the next list
                                    }
                                }
                                if (toggle) {
                                    collecting = !collecting;
                                    listIndex = collecting && carry > 0 ? 1 : 0;
                                    if (collecting) {
                                        splitIndex++;
                                        continue;
                                    }
                                    return {value: list, done: false};
                                }
                                listIndex = carry > 0 ? 1 : 0;
                                splitIndex++;
                                break;
                            }
                            if (collecting) {
                                listIndex++;
                                list.push(v.value);
                            }
                        }
                    } while (!v.done);
                    if (!finished) {
                        finished = !!v.done;
                        if (collecting) {
                            return {value: list, done: false};
                        }
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    };
}

function splitAsync<T>(
    iterable: AsyncIterable<T>,
    cb: (
        value: T,
        index: ISplitIndex,
        state: IterationState
    ) => boolean | Promise<boolean>,
    options?: ISplitOptions
): AsyncIterable<T[]> {
    return {
        [$A](): AsyncIterator<T[]> {
            const i = iterable[$A]();
            const state: IterationState = {};

            // quick access to the options:
            const carryStart = options?.carryStart
                ? options?.carryStart < 0
                    ? -1
                    : options?.carryStart > 0
                    ? 1
                    : 0
                : 0;
            const carryEnd = options?.carryEnd
                ? options?.carryEnd < 0
                    ? -1
                    : options?.carryEnd > 0
                    ? 1
                    : 0
                : 0;
            const toggle = !!options?.toggle;

            // all indexes:
            let startIndex = 0;
            let listIndex = 0;
            let splitIndex = 0;

            let collecting = !toggle; // indicates when we are collecting values
            let finished = false; // indicates when we are all done

            let prev: IteratorResult<T> | null; // previous value when carrying forward

            return {
                async next(): Promise<IteratorResult<T[]>> {
                    const list: T[] = [];
                    let v: IteratorResult<T>; // next value object
                    do {
                        if (prev) {
                            // previous trigger value is being moved forward;
                            list.push(prev.value);
                            prev = null;
                        }
                        v = await i.next();
                        if (!v.done) {
                            const index: ISplitIndex = {
                                start: startIndex++,
                                list: listIndex,
                                split: splitIndex,
                            };
                            if (await cb(v.value, index, state)) {
                                // split/toggle has been triggered;
                                const carry = collecting
                                    ? carryEnd
                                    : carryStart;
                                if (carry) {
                                    if (carry < 0) {
                                        list.push(v.value);
                                    } else {
                                        prev = v; // carry "forward", save for the next list
                                    }
                                }
                                if (toggle) {
                                    collecting = !collecting;
                                    listIndex = collecting && carry > 0 ? 1 : 0;
                                    if (collecting) {
                                        splitIndex++;
                                        continue;
                                    }
                                    return {value: list, done: false};
                                }
                                listIndex = carry > 0 ? 1 : 0;
                                splitIndex++;
                                break;
                            }
                            if (collecting) {
                                listIndex++;
                                list.push(v.value);
                            }
                        }
                    } while (!v.done);
                    if (!finished) {
                        finished = !!v.done;
                        if (collecting) {
                            return {value: list, done: false};
                        }
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    };
}
