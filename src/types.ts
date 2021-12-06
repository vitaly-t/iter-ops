/**
 * Iteration Error Context.
 */
export interface IErrorContext<T> {
    /**
     * Value Index.
     */
    index: number;

    /**
     * Last successfully retrieved value, if any (undefined otherwise).
     */
    lastValue?: T;

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
     * - undefined, if the iterable produced nothing.
     *
     * It is to simplify use of one-value iterables.
     */
    readonly first?: T;

    /**
     * Appends catchError operator to the pipeline.
     */
    catch(cb: (error: any, ctx: IErrorContext<T>) => void): IterableExt<T>;
}

export interface AsyncIterableExt<T> extends AsyncIterable<T> {
    /**
     * - first element produced by the iterable;
     * - undefined, if the iterable produced nothing.
     *
     * It is to simplify use of one-value iterables.
     */
    readonly first?: T;

    /**
     * Appends catchError operator to the pipeline.
     */
    catch(cb: (error: any, ctx: IErrorContext<T>) => void): IterableExt<T>;
}

/**
 * Any iterable type.
 */
export type AnyIterable<T> = Iterable<T> | AsyncIterable<T>;

/**
 * Any iterator type.
 */
export type AnyIterator<T> = Iterator<T> | AsyncIterator<T>;

/**
 * Pipe-through type (return type for all operators)
 */
export interface Operation<T, R> {
    (i: AnyIterable<T>): Operation<T, R>;
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
 * Iteration State.
 *
 * An object with random properties, shared between callbacks during an iteration session,
 * for any intermediate processing/tracking data that the callback logic may require.
 */
export type IterationState = { [name: string]: any };
