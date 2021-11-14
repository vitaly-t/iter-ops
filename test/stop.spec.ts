import {expect} from './header';
import {pipe, stop, toArray} from '../src';

describe('stop', () => {
    it('must work with numbers', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const output = pipe(input, stop(a => a > 5), toArray());
        expect(output.first).to.eql([1, 2, 3, 4, 5]);
    });
});
