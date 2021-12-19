import {_async, expect} from './header';
import {pipe, count} from '../src';

describe('sync count', () => {
    it('must count items correctly', () => {
        const input = [10, 20, 30];
        const output = pipe(input, count());
        expect(output.first).to.eql(input.length);
    });
    it('must handle empty iterables', () => {
        const output = pipe([], count());
        expect(output.first).to.eql(0);
    });
    it('must not generate more than one value', () => {
        const input = [10, 20, 30];
        const output = pipe(input, count());
        const i = output[Symbol.iterator]();
        const result = i.next() && i.next();
        expect(result).to.eql({value: undefined, done: true});
    });
});

describe('async count', () => {
    it('must count items correctly', async () => {
        const input = [10, 20, 30];
        const output = pipe(_async(input), count());
        expect(await output.first).to.eql(input.length);
    });
    it('must handle empty iterables', async () => {
        const output = pipe(_async([]), count());
        expect(await output.first).to.eql(0);
    });
    it('must not generate more than one value', async () => {
        const input = [10, 20, 30];
        const output = pipe(_async(input), count());
        const i = output[Symbol.asyncIterator]();
        const result = await i.next() && await i.next();
        expect(result).to.eql({value: undefined, done: true});
    });
});
