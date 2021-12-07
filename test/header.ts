import chai from 'chai';
import {describe} from 'mocha';

const expect = chai.expect;

export {chai, describe, expect};

export function _async<T>(list: Iterable<T>): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator]() {
            const i = list[Symbol.iterator]();
            return {
                async next() {
                    return i.next();
                }
            };
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
