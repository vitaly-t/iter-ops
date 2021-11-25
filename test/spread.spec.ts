import {expect} from './header';
import {pipe, spread} from '../src';

describe('spread', () => {
    it('must split strings', () => {
        const output = pipe(['one', 'two'], spread());
        expect([...output]).to.eql(['o', 'n', 'e', 't', 'w', 'o']);
    });
    it('must split arrays', () => {
        const output = pipe([[1, 2], [3, 4]], spread());
        expect([...output]).to.eql([1, 2, 3, 4]);
    });
    it('must handle empty iterables', () => {
        const output1 = pipe([], spread());
        const output2 = pipe([[]], spread());
        const output3 = pipe([[], []], spread());
        const output4 = pipe([''], spread());
        expect([...output1]).to.eql([]);
        expect([...output2]).to.eql([]);
        expect([...output3]).to.eql([]);
        expect([...output4]).to.eql([]);
    });
    it('must find values after empty', () => {
        const output = pipe([[], [1]], spread());
        expect([...output]).to.eql([1]);
    });
    it('must throw on non-iterable', () => {
        expect(() => {
            const i = pipe(['text', 123 as any], spread());
            [...i];
        }).to.throw('Value at index 1 is not iterable: 123');
    });
});
