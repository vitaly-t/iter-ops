import {expect} from './header';
import {pipe, reduce} from '../src';

describe('reduce', () => {
    it('must work with initial value', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const output = pipe(input, reduce((c, i) => c + i, 5));
        expect(output.first).to.eql(50);
    });
    it('must work without initial value', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const output = pipe(input, reduce((c, i) => c + i));
        expect(output.first).to.eql(45);
    });
});
