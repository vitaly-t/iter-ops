import {expect} from './header';
import {pipe, reduce} from '../src';

describe('reduce', () => {
    it('must work with initial value', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        expect(pipe(input, reduce((c, i) => c + i, 0))).to.eql(45);
    });
    /*
    it('must work without initial value', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        expect(pipe(input, reduce((c, i) => c + i))).to.eql(45);
    });*/
});
