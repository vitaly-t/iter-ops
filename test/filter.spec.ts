import {expect} from './header';
import {pipe, filter} from '../src';

describe('filter', () => {
    it('must emit on condition', () => {
        const input = [1, 2, 3, 4, 5, 0];
        const output = pipe(input, filter(a => a < 3));
        expect([...output]).to.eql([1, 2, 0]);
    });
});
