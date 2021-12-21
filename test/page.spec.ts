import {_async, _asyncValues, expect} from './header';
import {pipe, page} from '../src';

describe('sync page', () => {
    it('must handle divisible page sizes', () => {
        const input = [1, 2, 3, 4, 5, 6];
        const i = pipe(input, page(3));
        expect([...i]).to.eql([[1, 2, 3], [4, 5, 6]]);
    });
    it('must handle non-divisible page sizes', () => {
        const input1 = [1, 2, 3, 4, 5];
        const i1 = pipe(input1, page(3));
        expect([...i1], 'more than 1 page').to.eql([[1, 2, 3], [4, 5]]);

        const input2 = [1, 2];
        const i2 = pipe(input2, page(3));
        expect([...i2], 'less then 1 page').to.eql([[1, 2]]);
    });
    it('must handle empty iterables', () => {
        const i = pipe([], page(3));
        expect([...i]).to.eql([]);
    });
    it('must handle page size of 1', () => {
        const i = pipe([1, 2, 3], page(1));
        expect([...i]).to.eql([[1], [2], [3]]);
    });
    it('must throw during iteration when page size < 1 or invalid', () => {
        const errMsg = (value: any) => `Page size >= 1 is required: ${JSON.stringify(value)}`;
        expect(() => {
            pipe([], page(0)).first;
        }).to.throw(errMsg(0));
        expect(() => {
            pipe([], page(-1)).first;
        }).to.throw(errMsg(-1));
        expect(() => {
            pipe([], page('bla' as any)).first;
        }).to.throw(errMsg('bla'));
    });
});

describe('async page', () => {
    it('must handle divisible page sizes', async () => {
        const input = _async([1, 2, 3, 4, 5, 6]);
        const i = pipe(input, page(3));
        expect(await _asyncValues(i)).to.eql([[1, 2, 3], [4, 5, 6]]);
    });
    it('must handle non-divisible page sizes', async () => {
        const input1 = _async([1, 2, 3, 4, 5]);
        const i1 = pipe(input1, page(3));
        expect(await _asyncValues(i1), 'more than 1 page').to.eql([[1, 2, 3], [4, 5]]);

        const input2 = _async([1, 2]);
        const i2 = pipe(input2, page(3));
        expect(await _asyncValues(i2), 'less then 1 page').to.eql([[1, 2]]);
    });
    it('must handle empty iterables', async () => {
        const i = pipe(_async([]), page(3));
        expect(await _asyncValues(i)).to.eql([]);
    });
    it('must handle page size of 1', async () => {
        const i = pipe(_async([1, 2, 3]), page(1));
        expect(await _asyncValues(i)).to.eql([[1], [2], [3]]);
    });
    it('must throw once during iteration when page size < 1 or invalid', async () => {
        const errMsg = (value: any) => `Page size >= 1 is required: ${JSON.stringify(value)}`;
        const i = pipe(_async([]), page(0))[Symbol.asyncIterator]();
        let err: any;
        try {
            i.next();
        } catch (e) {
            err = e;
        }
        expect(err.message).to.eq(errMsg(0));
        expect(await i.next()).to.eql({value: undefined, done: true});
        try {
            await _asyncValues(pipe(_async([]), page(-1)));
        } catch (e) {
            err = e;
        }
        expect(err.message).to.eq(errMsg(-1));
        try {
            await _asyncValues(pipe(_async([]), page('bla' as any)));
        } catch (e) {
            err = e;
        }
        expect(err.message).to.eq(errMsg('bla'));
    });
});
