import {expect} from './header';
import {pipe, start} from '../src';

describe('start', () => {
    const input = [1, 2, 3, 4, 5];
    it('must trigger on condition', () => {
        const output = pipe(input, start(a => a > 3));
        expect([...output]).to.eql([4, 5]);
    });
    it('must support non-starters', () => {
        const output = pipe(input, start(a => a > 5));
        expect([...output]).to.eql([]);
    });
});
