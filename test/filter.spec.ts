import {expect} from './header';
import {filter, pipe, toArray} from '../src';

describe('filter', () => {
    it('must work with numbers', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        const output = pipe(input, filter(a => a < 5), toArray());
        expect(output.first).to.eql([1, 2, 3, 4, 0]);
    });
});
