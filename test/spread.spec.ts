import {_async, _asyncValues, expect} from './header';
import {pipe, spread} from '../src';

describe('sync spread', () => {
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

describe('async spread', () => {
    it('must split strings', async () => {
        const output = pipe(_async(['one', 'two']), spread());
        expect(await _asyncValues(output)).to.eql(['o', 'n', 'e', 't', 'w', 'o']);
    });
    it('must split arrays', async () => {
        const output = pipe(_async([[1, 2], [3, 4]]), spread());
        expect(await _asyncValues(output)).to.eql([1, 2, 3, 4]);
    });
    it('must handle empty iterables', async () => {
        const output1 = pipe(_async([]), spread());
        const output2 = pipe(_async([[]]), spread());
        const output3 = pipe(_async([[], []]), spread());
        const output4 = pipe(_async(['']), spread());
        expect(await _asyncValues(output1)).to.eql([]);
        expect(await _asyncValues(output2)).to.eql([]);
        expect(await _asyncValues(output3)).to.eql([]);
        expect(await _asyncValues(output4)).to.eql([]);
    });
    it('must find values after empty', async () => {
        const output = pipe(_async([[], [1]]), spread());
        expect(await _asyncValues(output)).to.eql([1]);
    });
    it('must throw on non-iterable', async () => {
        let err: any;
        try {
            await _asyncValues(pipe(_async(['text', 123 as any]), spread()));
        } catch (e) {
            err = e;
        }
        expect(err?.message).to.eql('Value at index 1 is not iterable: 123');
    });
});
