import {expect} from '../../header';
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
