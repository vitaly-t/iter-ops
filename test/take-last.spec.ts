import {_async, _asyncValues, expect} from './header';
import {pipe, takeLast} from '../src';

describe('sync takeLast', () => {
    const input = [10, 20, 30, 40, 50];
    it('must emit the right number of values', () => {
        const output = pipe(input, takeLast(2));
        expect([...output]).to.eql([40, 50]);
    });
    it('must emit nothing for zero', () => {
        const output = pipe(input, takeLast(0));
        expect([...output]).to.eql([]);
    });
    it('must emit all when count is too big', () => {
        const output = pipe(input, takeLast(100));
        expect([...output]).to.eql(input);
    });
});

describe('async takeLast', () => {
    const input = [10, 20, 30, 40, 50];
    it('must emit the right number of values', async () => {
        const output = pipe(_async(input), takeLast(2));
        expect(await _asyncValues(output)).to.eql([40, 50]);
    });
    it('must emit nothing for zero', async () => {
        const output = pipe(_async(input), takeLast(0));
        expect(await _asyncValues(output)).to.eql([]);
    });
    it('must emit all when count is too big', async () => {
        const output = pipe(_async(input), takeLast(100));
        expect(await _asyncValues(output)).to.eql(input);
    });
});
