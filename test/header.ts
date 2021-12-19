import chai from 'chai';
import {describe} from 'mocha';
import {toAsync} from '../src';

const expect = chai.expect;

export {chai, describe, expect};

export function _async<T>(i: Iterable<T>): AsyncIterable<T>;
export function _async<T>(i: Iterator<T>): AsyncIterator<T>;

export function _async<T>(i: any): any {
    if (typeof i[Symbol.iterator] === 'function') {
        return toAsync(i);
    }
    return {
        async next() {
            return i.next();
        }
    };
}

export async function _asyncValues<T>(input: AsyncIterable<T>): Promise<T[]> {
    const res = [];
    for await(const a of input) {
        res.push(a);
    }
    return res;
}

export function YSNP() {
    throw new Error('You Shall Not Pass!');
}
