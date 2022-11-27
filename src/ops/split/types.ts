/**
 * Value index details, during {@link split} operation.
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
 * Set of options that can be passed into {@link split} operator.
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
 * Note that {@link split} operator treats this enum in non-strict manner:
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
