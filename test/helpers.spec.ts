import {_asyncValues, expect} from './header';
import {toIterable, toAsync, mergeIterables} from '../src';

describe('toAsync', () => {
    it('must reuse async iterables', () => {
        const i = toAsync('hello');
        expect(toAsync(i as any)).to.eq(i);
    });
    it('must correctly wrap non-indexed iterables', async () => {
        const i: Iterable<number> = {
            [Symbol.iterator]() {
                let idx = 5;
                return {
                    next() {
                        return idx
                            ? {value: idx--}
                            : {value: undefined, done: true};
                    },
                };
            },
        };
        expect(await _asyncValues(toAsync(i))).to.eql([5, 4, 3, 2, 1]);
    });
});

describe('toIterable', () => {
    it('must reuse sync iterables', () => {
        const i = [1, 2, 3];
        expect(toIterable(i)).to.eq(i);
    });
    it('must reuse async iterables', () => {
        const i = toAsync('hello');
        expect(toIterable(i)).to.eq(i);
    });
    it('must convert a random value', () => {
        const i1 = toIterable(123);
        expect([...i1]).to.eql([123]);

        const i2 = toIterable(null);
        expect([...i2]).to.eql([null]);
    });
    it('must convert a resolved Promise', async () => {
        const i = toIterable(Promise.resolve(123));
        expect(await _asyncValues(i)).to.eql([123]);
    });
    it('must convert a rejected Promise', async () => {
        const i = toIterable(Promise.reject(123));
        let err;
        try {
            await _asyncValues(i);
        } catch (e) {
            err = e;
        }
        expect(err).to.eql(123);
    });
    it('must treat an invalid iterable as value', () => {
        const i1 = {
            next() {
                return null; // non-compliance return value
            },
        };
        expect([...toIterable(i1)]).to.eql([i1]);
        const i2 = {
            next() {
                return 555; // non-compliance return value
            },
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
            },
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
            },
        };
        expect(await _asyncValues(toIterable(i2))).to.eql([555]);
    });
});

describe('mergeIterables', () => {
    it('must merge sync iterables', () => {
        const input = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
        ];
        const output = mergeIterables(...input);
        expect([...output]).to.deep.eq(input.flat());
    });
});
