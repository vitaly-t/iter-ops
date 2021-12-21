import {_async, _asyncValues, expect} from '../header';
import {pipe, map, wait} from '../../src';

describe('wait', () => {
    it('must resolve promises', async () => {
        const i = pipe(_async([1, 2, 3]), map(a => Promise.resolve(a)), wait());
        expect(await _asyncValues(i)).to.eql([1, 2, 3]);
    });
    it('must allow simple values', async () => {
        const i = pipe(_async([1, 2, 3]), wait());
        expect(await _asyncValues(i)).to.eql([1, 2, 3]);
    });
    it('must throw on synchronous pipeline once', () => {
        const i = pipe([], wait())[Symbol.iterator]();
        expect(() => {
            i.next();
        }).to.throw('Operator "wait" requires asynchronous pipeline');
        expect(i.next()).to.eql({value: undefined, done: true});
    });
});
