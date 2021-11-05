export type Piper<T> = (i: Iterable<T>) => Iterable<T>;
export type Terminator<T> = () => { process: (i: Iterable<T>) => T };
