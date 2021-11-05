export type Piper<T, R = T> = (i: Iterable<T>) => Iterable<R>;
export type Terminator<T> = () => { process: (i: Iterable<T>) => T };
