import {expect} from './header';
import {pipe, start} from '../src';

describe('start', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    it('must work with numbers', () => {
        const output = pipe(input, start(a => a > 5));
        expect([...output]).to.eql([6, 7, 8, 9]);
    });
    it('must support non-starters', () => {
        const output = pipe(input, start(a => a > 9));
        expect([...output]).to.eql([]);
    });
});
