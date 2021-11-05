import {Piper, Terminator} from './common';

export function pipe<T>(i: Iterable<T>, t: Terminator<T>): T;
export function pipe<T>(i: Iterable<T>, p1: Piper<T>, t: Terminator<T>): T;
export function pipe<T>(i: Iterable<T>, p1: Piper<T>, p2: Piper<T>, t: Terminator<T>): T;
export function pipe<T>(i: Iterable<T>, p1: Piper<T>, p2: Piper<T>, p3: Piper<T>, t: Terminator<T>): T;
export function pipe<T>(i: Iterable<T>, p1: Piper<T>, p2: Piper<T>, p3: Piper<T>, p4: Piper<T>, t: Terminator<T>): T;
export function pipe<T>(i: Iterable<T>, p1: Piper<T>, p2: Piper<T>, p3: Piper<T>, p4: Piper<T>, p5: Piper<T>, t: Terminator<T>): T;

export function pipe<T>(i: Iterable<T>, ...p: Piper<T>[]): Iterable<T>;

export function pipe<T>(i: Iterable<T>, ...pt: (Piper<T> | Terminator<T>)[]): Iterable<T> | T {
    let prev: any = i;
    for (const a of pt) {
        const res = a(prev) as any;
        if (res[Symbol.iterator]) {
            prev = res;
            continue;
        }
        return res.process(prev);
    }
    return prev;
}
