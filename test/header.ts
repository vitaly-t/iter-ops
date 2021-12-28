import chai from 'chai';
import {describe} from 'mocha';
import {toAsync} from '../src';

const expect = chai.expect;

export {chai, describe, expect};

export function _async<T>(i: Iterable<T>): AsyncIterable<T>;
export function _async<T>(i: Iterator<T>): AsyncIterator<T>;

export function _async(i: any): any {
    if (typeof i[Symbol.iterator] === 'function') {
        return toAsync(i);
    }
    return {
        async next() {
            return i.next();
        }
    };
}

/**
 * It is important to rely on native promises below, to make sure that all
 * async iterators return promises when expected, and never values directly.
 */
export function _asyncValues<T>(input: AsyncIterable<T>): Promise<T[]> {
    const res: T[] = [];
    const i = input[Symbol.asyncIterator]();
    const getValues = (): Promise<T[]> => i.next().then(a => {
        if (a.done) {
            return res;
        }
        res.push(a.value);
        return getValues();
    });
    return getValues();
}

export function YSNP() {
    throw new Error('You Shall Not Pass!');
}
