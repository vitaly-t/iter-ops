import {expect} from './header';
import {pipe, split} from '../src';

describe('split', () => {
    it('must do regular split', () => {
        const i = pipe('one two three', split(a => a === ' '));
        expect([...i]).to.eql([['o', 'n', 'e'], ['t', 'w', 'o'], ['t', 'h', 'r,', 'e', 'e']]);
    });
    it('must process gaps correctly', () => {
        const i = pipe([0, 1, 2, 0, 3, 4, 0, 0], split(a => a === 0));
        expect([...i]).to.eql([null, [1, 2], [3, 4], null, null]);
    });
});
