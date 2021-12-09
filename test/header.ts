import chai from 'chai';
import {describe} from 'mocha';
import {toAsync} from '../src';

const expect = chai.expect;

export {chai, describe, expect};

export function _async<T>(i: Iterable<T> = []): AsyncIterable<T> {
    return toAsync(i);
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
