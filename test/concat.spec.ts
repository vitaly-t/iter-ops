import {expect} from './header';
import {pipe, concat} from '../src';

describe('concat', () => {
    describe('with no inputs', () => {
        it('must produce only the source', () => {
            const result = pipe([1, 2, 3], concat());
            expect([...result]).to.eql([1, 2, 3]);
        });
        it('must produce nothing', () => {
            const result = pipe([], concat());
            expect([...result]).to.eql([]);
        });
    });
    describe('with empty source', () => {
        it('must append inputs', () => {
            const result = pipe([], concat(1, [2, 3]));
            expect([...result]).to.eql([1, 2, 3]);
        });
    });
    describe('multicast', () => {
        it('must join value types', () => {
            const result = pipe([1, 2, 3], concat('next', true));
            expect([...result]).to.eql([1, 2, 3, 'next', true]);
        });
        it('must join iterable types', () => {
            const result = pipe([1, 2, 3], concat('hello', ['world', true]));
            expect([...result]).to.eql([1, 2, 3, 'hello', 'world', true]);
        });
    });
});
