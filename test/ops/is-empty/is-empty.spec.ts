import {_async, _asyncValues, expect} from '../../header';
import {pipe, isEmpty} from '../../../src';

describe('sync isEmpty', () => {
    it('must detect empty iterables', () => {
        const output = pipe([], isEmpty());
        expect([...output]).to.eql([true]);
    });
    it('must detect non-empty iterables', () => {
        const output = pipe([1], isEmpty());
        expect([...output]).to.eql([false]);
    });
});

describe('async isEmpty', () => {
    it('must detect empty iterables', async () => {
        const output = pipe(_async([]), isEmpty());
        expect(await _asyncValues(output)).to.eql([true]);
    });
    it('must detect non-empty iterables', async () => {
        const output = pipe(_async([1]), isEmpty());
        expect(await _asyncValues(output)).to.eql([false]);
    });
});
