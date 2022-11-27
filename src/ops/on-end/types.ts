/**
 * Value-duration details, for minimum or maximum duration, used in {@link IDuration}.
 *
 * @see {@link IDuration}
 */
export interface IValueDuration<T> {
    /**
     * Delay in ms it took to get the value.
     */
    delay: number;

    /**
     * Index of the value.
     */
    index: number;

    /**
     * The value retrieved.
     */
    value: T;
}

/**
 * All duration/performance details, used in {@link IIterationSummary}.
 *
 * @see {@link IIterationSummary}
 */
export interface IDuration<T> {
    /**
     * Average duration, for processing one value:
     *  - = `total` / `count`, if `count` > 0
     *  - = 0, if `count` = 0
     */
    average: number;

    /**
     * Maximum iteration-delay details.
     *
     * It is `undefined` when the iteration is empty (`count` = 0).
     */
    max?: IValueDuration<T>;

    /**
     * Minimum iteration-delay details.
     *
     * It is `undefined` when the iteration is empty (`count` = 0).
     */
    min?: IValueDuration<T>;

    /**
     * Total duration, in ms, for the entire iteration.
     */
    total: number;
}

/**
 * Iteration summary, produced by {@link onEnd} operator.
 *
 * @see {@link onEnd}
 */
export interface IIterationSummary<T> {
    /**
     * Number of items iterated.
     */
    count: number;

    /**
     * Duration details, to help measure iteration performance.
     */
    duration: IDuration<T>;

    /**
     * Last emitted value, if there was any (`undefined` otherwise).
     */
    lastValue: T | undefined;

    /**
     * Iteration concurrency flag:
     *  - `true` - synchronous iteration
     *  - `false` - asynchronous iteration
     */
    sync: boolean;
}
