/**
 * Pipe-through type.
 */
export interface Piper<T, R> {
    (i: Iterable<T>): Iterable<R>;
}

export interface IterableExt<T> extends Iterable<T> {
    readonly first: T;
}
