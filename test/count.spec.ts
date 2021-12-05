import {expect} from './header';
import {pipe, count} from '../src';

describe('count', () => {
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
