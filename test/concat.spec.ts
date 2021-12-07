import {_async, _asyncValues, expect} from './header';
import {pipe, concat} from '../src';

describe('sync concat', () => {
    describe('with iterators', () => {
        it('must support regular ones', () => {
            const input = [1, 2, 3][Symbol.iterator]();
            const result = pipe([], concat(input));
            expect([...result]).to.eql([1, 2, 3]);
        });
        it('must support synthetic ones', () => {
            let count = 3;
            const input: Iterator<number> = {
                next() {
                    if (count--) {
                        return {value: count};
                    }
                    return {value: undefined, done: true};
                }
            };
            const result = pipe([], concat(input));
            expect([...result]).to.eql([2, 1, 0]);
        });
        it('must treat "next" property as value', () => {
            const input = {next: 123};
            const result = pipe([], concat(input));
            expect([...result]).to.eql([input]);
        });
    });
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
            const result = pipe([1, 2], concat(null, 'next', true));
            expect([...result]).to.eql([1, 2, null, 'n', 'e', 'x', 't', true]);
        });
        it('must join iterable types', () => {
            const result = pipe([1, 2], concat('one', [undefined, 'word', false]));
            expect([...result]).to.eql([1, 2, 'o', 'n', 'e', undefined, 'word', false]);
        });
    });
});

// TODO: Need to add tests for handling async iterables!

describe('async concat', () => {
    describe('with iterators', () => {
        it('must support regular ones', async () => {
            const input = [1, 2, 3][Symbol.iterator]();
            const result = pipe(_async(), concat(input));
            expect(await _asyncValues(result)).to.eql([1, 2, 3]);
        });
        it('must support synthetic ones', async () => {
            let count = 3;
            const input: Iterator<number> = {
                next() {
                    if (count--) {
                        return {value: count};
                    }
                    return {value: undefined, done: true};
                }
            };
            const result = pipe(_async(), concat(input));
            expect(await _asyncValues(result)).to.eql([2, 1, 0]);
        });
        it('must treat "next" property as value', async () => {
            const input = {next: 123};
            const result = pipe(_async(), concat(input));
            expect(await _asyncValues(result)).to.eql([input]);
        });
    });
    describe('with no inputs', () => {
        it('must produce only the source', async () => {
            const result = pipe(_async([1, 2, 3]), concat());
            expect(await _asyncValues(result)).to.eql([1, 2, 3]);
        });
        it('must produce nothing', async () => {
            const result = pipe(_async(), concat());
            expect(await _asyncValues(result)).to.eql([]);
        });
    });
    describe('with empty source', () => {
        it('must append inputs', async () => {
            const result = pipe(_async(), concat(1, [2, 3]));
            expect(await _asyncValues(result)).to.eql([1, 2, 3]);
        });
    });
    describe('multicast', () => {
        it('must join value types', async () => {
            const result = pipe(_async([1, 2]), concat(null, 'next', true));
            expect(await _asyncValues(result)).to.eql([1, 2, null, 'n', 'e', 'x', 't', true]);
        });
        it('must join iterable types', async () => {
            const result = pipe(_async([1, 2]), concat('one', [undefined, 'word', false]));
            expect(await _asyncValues(result)).to.eql([1, 2, 'o', 'n', 'e', undefined, 'word', false]);
        });
    });
});
