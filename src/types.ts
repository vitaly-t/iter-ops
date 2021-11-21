export interface IErrorInfo<T> {
    index: number;
    lastValue?: T;

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
     * Appends catchError operator to the end of the iterable,
     * with the specified callback function.
     */
    catch(cb: (error: any, info: IErrorInfo<T>) => void): IterableExt<T>;
}

/**
 * Pipe-through type (return type for all operators)
 */
export interface Piper<T, R> {
    (i: Iterable<T>): Iterable<R>;
}

/**
 * Any templated value type: Value | Iterator | Iterable
 */
export type Any<T> = T | Iterator<T> | Iterable<T>;
