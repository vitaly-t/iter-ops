import {_asyncValues, expect} from './header';
import {toIterable, toAsync} from '../src';

describe('toIterable', () => {
    it('must convert a random value', () => {
        const i1 = toIterable(123);
        expect([...i1]).to.eql([123]);

        const i2 = toIterable(null);
        expect([...i2]).to.eql([null]);
    });
    it('must treat an invalid iterable as value', () => {
        const i1 = {
            next() {
                return null; // non-compliance return value
            }
        };
        expect([...toIterable(i1)]).to.eql([i1]);
        const i2 = {
            next() {
                return 555; // non-compliance return value
            }
        };
        expect([...toIterable(i2)]).to.eql([i2]);
    });
    it('must convert any sync iterator', () => {
        const i1 = toIterable([1, 2, 3][Symbol.iterator]());
        expect([...i1]).to.eql([1, 2, 3]);

        let finished = false;
        const i2 = {
            next() {
                if (finished) {
                    return {value: undefined, done: true};
                }
                finished = true;
                return {value: 555, done: false};
            }
        };
        expect([...toIterable(i2)]).to.eql([555]);
    });
    it('must convert any async iterator', async () => {
        const i1 = toIterable(toAsync([1, 2, 3])[Symbol.asyncIterator]());
        expect(await _asyncValues(i1)).to.eql([1, 2, 3]);

        let finished = false;
        const i2 = {
            next() {
                if (finished) {
                    return Promise.resolve({value: undefined, done: true});
                }
                finished = true;
                return Promise.resolve({value: 555, done: false});
            }
        };
        expect(await _asyncValues(toIterable(i2))).to.eql([555]);
    });
});
