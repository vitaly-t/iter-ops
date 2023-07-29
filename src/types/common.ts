/**
 * Iteration Error Context.
 *
 * It is passed into every error handler as the second parameter.
 *
 * @see {@link catchError}
 */
export interface IErrorContext<T> {
    /**
     * Index of the value that threw an error.
     */
    index: number;

    /**
     * Last successfully retrieved value, if any (`undefined` otherwise).
     */
    lastValue?: T;

    /**
     * Number of times the error has been repeated (starts with 0).
     *
     * It helps to detect when an iterator starts throwing the same error
     * in a loop, so a different error-handling strategy can be applied,
     * such as (for example) re-throwing only when the error is repeated.
     *
     * ```ts
     * .catch((e, ctx) => {
     *     if(ctx.repeats) {
     *         throw e; // re-throw when repeated
     *     }
     *     console.log(e?.message || e); // report the error
     * });
     * ```
     */
    repeats: number;

    /**
     * Iteration state, persisted through entire iteration session.
     */
    state: IterationState;

    /**
     * Alternative value emitter, to replace what we failed to retrieve.
     * Without this call, the errored value is skipped from iteration.
     */
    emit(value: T): void;
}

/**
 * Extended Iterable.
 */
export interface IterableExt<T> extends Iterable<T> {
    /**
     * A getter that creates a new iterator, iterates to the first element and returns the value.
     *
     * It is to simplify accessing value of single-element iterables.
     *
     * @returns
     * - first element produced by the iterable;
     * - `undefined`, if the iterable produced nothing.
     */
    readonly first: T | undefined;

    /**
     * Appends {@link catchError} operator to the end of pipeline.
     *
     * @see {@link https://github.com/vitaly-t/iter-ops/wiki/Error-Handling Error Handling}
     */
    catch(cb: (error: any, ctx: IErrorContext<T>) => void): IterableExt<T>;
}

/**
 * Extended Asynchronous Iterable.
 */
export interface AsyncIterableExt<T> extends AsyncIterable<T> {
    /**
     * A getter that creates a new iterator, iterates to the first element and returns the value.
     *
     * It is to simplify accessing value of single-element iterables.
     *
     * @returns
     * - first element / `Promise` produced by the iterable;
     * - `Promise<undefined>`, if the iterable produced nothing.
     */
    readonly first: Promise<T | undefined>;

    /**
     * Appends {@link catchError} operator to the end of pipeline.
     *
     * @see {@link https://github.com/vitaly-t/iter-ops/wiki/Error-Handling Error Handling}
     */
    catch(cb: (error: any, ctx: IErrorContext<T>) => void): AsyncIterableExt<T>;
}

/**
 * An `Iterable` that could either be sync or async.
 */
export type UnknownIterable<T> = Iterable<T> | AsyncIterable<T>;

/**
 * An `Iterator` that could either be sync or async.
 */
export type UnknownIterator<T, TReturn = any, TNext = undefined> =
    | Iterator<T, TReturn, TNext>
    | AsyncIterator<T, TReturn, TNext>;

/**
 * Either an `Iterable` or `Iterator` that could either be sync or async.
 */
export type UnknownIterableOrIterator<T> =
    | UnknownIterable<T>
    | UnknownIterator<T>;

/**
 * A Typed array.
 */
export type TypedArray = ArrayBufferView & ArrayLike<unknown>;

/**
 * Pipe-through type (return type for all operators)
 */
export interface Operation<T, R> {
    (i: UnknownIterable<T>): UnknownIterable<R>;
}

/**
 * Any synchronous value type.
 */
export type SyncValue<T> = T | Iterator<T> | Iterable<T>;

/**
 * Any synchronous or asynchronous value type.
 */
export type Value<T> = SyncValue<T> | AsyncIterator<T> | AsyncIterable<T>;

/**
 * Iteration Session State.
 *
 * An object with random properties, reused between callbacks during iteration session (local to the operator),
 * for any processing logic as required.
 *
 * @see
 *  - {@link https://github.com/vitaly-t/iter-ops/wiki/Iteration-State Iteration State WiKi}
 */
export type IterationState = {[name: string]: any};
