/**
 * Iteration Error Context.
 *
 * It is passed into every error handler as the second parameter.
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
     * - first element produced by the iterable;
     * - `undefined`, if the iterable produced nothing.
     *
     * It is to simplify use of one-value iterables.
     *
     * _IMPORTANT:_ It is a getter that creates a new iterator from the iterable,
     * and then iterates to the first value.
     */
    readonly first: T | undefined;

    /**
     * Appends {@link catchError} operator to the pipeline.
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
     * - first element/`Promise` produced by the iterable;
     * - `Promise<undefined>`, if the iterable produced nothing.
     *
     * It is to simplify use of one-value iterables.
     *
     * _IMPORTANT:_ It is a getter that creates a new iterator from the iterable,
     * and then iterates to the first value.
     */
    readonly first: Promise<T | undefined>;

    /**
     * Appends {@link catchError} operator to the pipeline.
     *
     * @see {@link https://github.com/vitaly-t/iter-ops/wiki/Error-Handling Error Handling}
     */
    catch(cb: (error: any, ctx: IErrorContext<T>) => void): AsyncIterableExt<T>;
}

/**
 * Any-Iterable Type.
 */
export type AnyIterable<T> = Iterable<T> | AsyncIterable<T>;

/**
 * Any-Iterator Type.
 */
export type AnyIterator<T> = Iterator<T> | AsyncIterator<T>;

/**
 * Any Iterable Iterator.
 */
export type AnyIterableIterator<T> = AnyIterable<T> | AnyIterator<T>;

/**
 * Pipe-through type (return type for all operators)
 */
export interface Operation<T, R> {
    (i: AnyIterable<T>): AnyIterable<R>;
}

/**
 * Any synchronous value type.
 */
export type AnySync<T> = T | Iterator<T> | Iterable<T>;

/**
 * Any synchronous or asynchronous value type.
 */
export type Any<T> = AnySync<T> | AsyncIterator<T> | AsyncIterable<T>;

/**
 * Iteration Session State.
 *
 * An object with random properties, shared between callbacks during an iteration session,
 * for any intermediate processing/tracking data that the callback logic may require.
 *
 * @see {@link https://github.com/vitaly-t/iter-ops/wiki/Iteration-State Iteration State WiKi}
 */
export type IterationState = {[name: string]: any};

/**
 * These are for code abbreviation + smaller bundles:
 */
export const $S: typeof Symbol.iterator = Symbol.iterator;
export const $A: typeof Symbol.asyncIterator = Symbol.asyncIterator;
